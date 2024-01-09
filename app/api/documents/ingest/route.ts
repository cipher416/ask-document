import { getServerSession } from "next-auth"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import prisma from "@/lib/db";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { promises as fs } from 'fs';
import {readPdfText}from 'pdf-text-reader';
import { createClient } from "@supabase/supabase-js";
import { tmpdir } from 'os';
import { authOptions } from "@/lib/options";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const formData = await request.formData();
  const file = formData.get("file");
	const fileName = formData.get("fileName")!.toString();
  if (file instanceof Blob){
    const tempFilePath = `${tmpdir}/temp.pdf`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);
		const text = await readPdfText({url: tempFilePath});
		const userDocument = await prisma.userDocuments.create({
			data: {
				userId: session!.user!.id,
				name: fileName
			}
		})
		const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 2000,
      chunkOverlap: 200,
    });
		let splitDocuments = await splitter.splitDocuments([new Document({ pageContent: text ,metadata:{
			userId: userDocument.userId,
			documentId: userDocument.id,
			documentName : userDocument.name,
		}}),]);

		const supabaseClient = createClient(
			process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
		);
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
      documentId: userDocument.id
    });
  }
}