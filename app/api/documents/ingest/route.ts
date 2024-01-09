import { getServerSession } from "next-auth"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createId } from '@paralleldrive/cuid2';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { promises as fs } from 'fs';
import {readPdfText}from 'pdf-text-reader';
import { createClient } from "@supabase/supabase-js";
import { tmpdir } from 'os';
import { authOptions } from "@/lib/options";

export async function POST(request: Request) {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.js");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js";
  const session = await getServerSession(authOptions);
  const formData = await request.formData();
  const file = formData.get("file");
	const fileName = formData.get("fileName")!.toString();
  const newDocumentId = createId();
  if (file instanceof Blob){
    const tempFilePath = `${tmpdir}/temp.pdf`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);
		const text = await readPdfText({url: tempFilePath});
    const supabaseClient = createClient(
			process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
		);
		const {data, error} = await supabaseClient.from('UserDocuments').insert({
      id: newDocumentId,
      name: fileName,
      userId: session!.user.id
    }).select();
		const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 2000,
      chunkOverlap: 200,
    });
    console.log(data, error)
		let splitDocuments = await splitter.splitDocuments([new Document({ pageContent: text ,metadata:{
			userId: session!.user.id,
			documentId: (data as any).id,
			documentName : fileName,
		}}),]);

		const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client: supabaseClient,
        tableName: "document",
        queryName: "match_documents",
      },
    );
    await fs.rm(tempFilePath);

		return Response.json({
      documentId: newDocumentId
    });
  }
}