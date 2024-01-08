"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DocumentService from "@/services/DocumentService";
import { FormInputData } from "@/types/types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function Home() {
  const router = useRouter();
  const {status} = useSession();
  const form = useForm<FormInputData>();

  async function onSubmit(values:FormInputData) {
    const result = await DocumentService.ingestDocument(values);
    router.push(`/${result}`);
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
