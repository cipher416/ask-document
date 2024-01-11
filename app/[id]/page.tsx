"use client";

import ChatBubble from '@/components/ui/chatbubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'
import { useChat } from 'ai/react';
import ChatService from '@/services/ChatService';
import {Message} from 'ai/react'
import { useEffect, useState } from 'react';
import DocumentService from '@/services/DocumentService';
import { UserDocuments } from '@prisma/client';

export default function Chat({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<UserDocuments>();
  const { messages, isLoading,setInput,input,handleInputChange, handleSubmit, setMessages} = useChat({api: `/api/chat/${params.id}`,
    onResponse:()=> {
      setInput('');
    },
  });
  useEffect(() => {
    DocumentService.getDocument(params.id).then((result)=> {
      setDocument(result);
    })
    ChatService.getAllChats(params.id).then((result: Message[]) => {
      setMessages(result);
    });
  }, [params.id, setMessages])

  return (
    <div className='flex flex-col justify-center items-center space-y-2'>
      <div className='flex flex-col p-10 space-y-2 w-4/5 h-[80dvh] '>
        <h1 className="font-extrabold text-3xl mb-5">
            Document : {document?.name}
        </h1>
        <div className='overflow-y-scroll'>
          {
            messages.map(m => {
              return <ChatBubble message={m} key={m.id}/>
            })
          }
        </div>
      </div>
        <form onSubmit={handleSubmit} className='flex flex-row space-x-5 w-full justify-center'>
          <Input type='text' disabled={isLoading} value={input} className='max-w-7xl' placeholder='Enter Message' onChange={handleInputChange}/>
          <Button type='submit' disabled={isLoading}>
            <SendHorizontal />
          </Button>
        </form>
    </div>
  )
}
