import { NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import prisma from "@/lib/db";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { Document } from "@langchain/core/documents";
import { SupabaseFilterRPCCall, SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  StringOutputParser,
} from "@langchain/core/output_parsers";


async function GET(request: Request, { params }: { params: { id: string } }) {
  const documentId = params.id;
  let chats = await prisma.chat.findMany({
    where: {
      userDocumentId: {
        equals: documentId
      }
    }, 
    orderBy : {
      insertedDate: 'asc'
    }
  });
  return Response.json({chats});
}

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};


const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};


const questionPrompt = 
  `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------
CONTEXT: {context}
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:`;

async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    console.log(params)
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(questionPrompt);
    console.log('test',formatVercelMessages(formattedPreviousMessages));
    const client = createClient(
			process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
		);
    const funcFilter: SupabaseFilterRPCCall = (rpc) =>
    rpc
      .filter("metadata->>documentId", "eq", params.id);
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
      client,
      tableName: "document",
      queryName: "match_documents",
      filter: funcFilter
    });
    
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-1106",
      temperature: 0.2,
    });
    const retriever = vectorStore.asRetriever(4);
    const chain = RunnableSequence.from([
      {
        question: (input: { question: string; chatHistory?: string }) =>
          input.question,
        chatHistory: (input: { question: string; chatHistory?: string }) =>
          input.chatHistory ?? "",
        context: async (input: { question: string; chatHistory?: string }) => {
          const relevantDocs = await retriever.getRelevantDocuments(input.question);
          const serialized = formatDocumentsAsString(relevantDocs);
          return serialized;
        },
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);
    console.log(typeof currentMessageContent);
    const response = await chain.invoke({question:currentMessageContent, chatHistory: formatVercelMessages(formattedPreviousMessages)});
    await prisma.chat.createMany({
      data: [
        {
          userDocumentId: params.id,
          role: "user",
          content: currentMessageContent,
        },
        {
          userDocumentId: params.id,
          role: "assistant",
          content: response,
        }
      ]
    });
    return Response.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export {GET, POST};