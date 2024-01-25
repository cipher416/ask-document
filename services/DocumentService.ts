
import { UserDocuments } from "@/prisma/generated/client";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createId } from '@paralleldrive/cuid2';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";



export default class DocumentService {
  static async getAllDocuments() : Promise<UserDocuments[]> {
    return (await (await fetch('/api/documents', {
      cache: "no-cache"
    })).json()).documents;
  }

  static async ingestDocument(input:FormData) : Promise<any> {
    "use server";
    const userId = input.get('userId');
    const fileName = input.get('fileName');
    const file = input.get('file');

    const newDocumentId = createId();
    console.log(newDocumentId);
    const supabaseClient = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
		);
		const {data, error} = await supabaseClient.from('UserDocuments').insert({
      id: newDocumentId,
      name: fileName,
      userId: userId
    }).select();
		const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 2000,
      chunkOverlap: 200,
    });

		let splitDocuments = await splitter.splitDocuments([new Document({ pageContent: file as string ,metadata:{
			userId: userId,
			documentId: newDocumentId,
			documentName : fileName,
		}}),]);
		const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!
      }),
      {
        client: supabaseClient,
        tableName: "document",
        queryName: "match_documents",
      },
    );
    console.log(newDocumentId)
    return newDocumentId;
  }

  static async getDocument(id: string): Promise<UserDocuments> {
    return await (await fetch(`/api/documents/${id}`)).json();
  }
}