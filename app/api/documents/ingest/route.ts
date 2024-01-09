import { getServerSession } from "next-auth"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createId } from '@paralleldrive/cuid2';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { promises as fs } from 'fs';
import { createClient } from "@supabase/supabase-js";
import { tmpdir } from 'os';
import { authOptions } from "@/lib/options";
import { getTextFromPDF } from "@/lib/utils";

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);
  const formData = await request.formData();
  const file = formData.get("file");
	const fileName = formData.get("fileName")!.toString();
  const newDocumentId = createId();
  if (file instanceof Blob){
    const tempFilePath = `${tmpdir}/temp.pdf`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);
		const text = await getTextFromPDF(tempFilePath);
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
      chunkSize: 200,
      chunkOverlap: 20,
    });

		let splitDocuments = await splitter.splitDocuments([new Document({ pageContent: text ,metadata:{
			userId: session!.user.id,
			documentId: data![0].id,
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
    console.log(data)
    await fs.rm(tempFilePath);

		return Response.json({
      documentId: newDocumentId
    });
  }
}