"use server";

import { UserDocuments } from "@/prisma/generated/client";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createId } from '@paralleldrive/cuid2';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
async function ingestDocument(input:FormData) : Promise<any> {

  const userId = input.get('userId');
  const fileName = input.get('fileName');
  const file = input.get('file');
  const newDocumentId = createId();
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
      upsertBatchSize: 100
    },
  );
  console.log(newDocumentId)
  return newDocumentId;
}