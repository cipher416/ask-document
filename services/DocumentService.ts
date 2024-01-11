
import { FormInputData, FormSendData } from "@/types/types";
import { UserDocuments } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";


export default class DocumentService {
  static async getAllDocuments() : Promise<UserDocuments[]> {
    return (await (await fetch('/api/documents', {
      cache: "no-cache"
    })).json()).documents;
  }

  static async ingestDocument(input:FormSendData) : Promise<string> {
    const formData = new FormData();
    formData.append("file", input.file);
    formData.append("fileName", input.fileName);
    const result = await fetch('/api/documents/ingest', {
      method: "POST",
      body: formData,
      cache: "no-cache",
    });
    return (await result.json()).documentId;
  }
}