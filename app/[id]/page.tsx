"use client";

import ChatBubble from '@/components/ui/chatbubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'
import { useChat } from 'ai/react';
import ChatService from '@/services/ChatService';
import { useEffect, useState } from 'react';
import {Message} from 'ai/react'

export default function Chat({ params }: { params: { id: string } }) {
  const { messages, input, handleInputChange, handleSubmit, setMessages} = useChat({api: `/api/chat/${params.id}`,
    onResponse:(response)=> {
      console.log(response);
    },
  });
  ChatService.getAllChats(params.id).then((result: Message[]) => {
    setMessages(result);
  });


  return (
    
    <div className='flex flex-col justify-center items-center space-y-2'>
      <div className='flex flex-col p-10 space-y-2 overflow-y-scroll w-4/5 h-[80dvh] '>
        {
          messages.map(m => {
            return <ChatBubble message={m} key={m.id}/>
          })
        }
      </div>
        <form onSubmit={handleSubmit} className='flex flex-row space-x-5 w-full justify-center'>
          <Input type='text' className='max-w-7xl' placeholder='Enter Message' onChange={handleInputChange}/>
          <Button type='submit'>
            <SendHorizontal />
          </Button>
        </form>
    </div>
  )
}
