import { getServerSession } from "next-auth"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createId } from '@paralleldrive/cuid2';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/options";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const formData = await request.formData();
    console.log('------1-------')
    const file = formData.get("file");
    const fileName = formData.get("fileName");
    const newDocumentId = createId();
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
      chunkOverlap: 100,
    });

		let splitDocuments = await splitter.splitDocuments([new Document({ pageContent: file as string ,metadata:{
			userId: session!.user.id,
			documentId: data![0].id,
			documentName : fileName,
		}}),]);
    console.log('------2-------')
		const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client: supabaseClient,
        tableName: "document",
        queryName: "match_documents",
      },
    );
    console.log('------3-------')
		return Response.json({
      documentId: newDocumentId
    });
}
