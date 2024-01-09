import { Message } from "ai/react";

export default class ChatService {
  static async getAllChats(id: string): Promise<[]> {
    const chats = (await (await fetch(`/api/chat/${id}`)).json()).chats;
    return chats;
  }
} 