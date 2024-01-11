"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DocumentService from "@/services/DocumentService";
import { FormInputData, FormSendData } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  useForm } from "react-hook-form";


export default function Home() {
  const router = useRouter();
  const {status} = useSession();
  const form = useForm<FormInputData>();

  async function onSubmit(values:FormInputData) {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";
    const reader = new FileReader();

    reader.onload = async (e) => {
      const contents = e.target!.result;
      const pdf = await pdfjs.getDocument(contents as ArrayBuffer).promise;
      const pages = pdf.numPages;
      let pageContents = '';
      for (let i = 0; i < pages; i++) {
        let page1 = await pdf.getPage(i + 1);
        let content = await page1.getTextContent();
        let strings = content.items.map(function(item: any) {
            return item.str;
        });
        pageContents += strings.join(" ");
      }
      console.log(pageContents);
      const a = {
        file: pageContents,
        fileName: values.fileName
      } satisfies FormSendData
      const result = await DocumentService.ingestDocument(a);
      router.push(`/${result}`);
    }
    reader.readAsArrayBuffer(values.file);
  }

  return (
    <div className='grid content-center'>
      <Form {...form}>
        <form className="m-20 flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
          name="fileName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Document Name..." required {...field} />
              </FormControl>
              <FormDescription>
                The document will be stored using this name.
              </FormDescription>
            </FormItem>
          )}
          />
          <div>
            <FormField
            name="file"
            control={form.control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                  <FormLabel htmlFor="picture">Document</FormLabel>
                  <FormControl>
                    <Input id="picture" type="file" accept="application/pdf" {...field} onChange={(event) => {
                    if (!event.target.files) return;
                    onChange(event.target.files[0]);
                  }}/>
                  </FormControl>  
                  <FormDescription>
                    Only accepts PDF Files.
                  </FormDescription>
              </FormItem>
          )}/>
          </div>
          <Button type="submit" disabled={status !== 'authenticated'} >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
