export default class ChatService {
  static async getAllChats(id: string) {
    const chats = (await (await fetch(`/api/chat/${id}`)).json()).chats;
    return chats;
  }
} 