"use client";

import ChatBubble from '@/components/chatbubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'
import Message from 'ai/react'

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col p-10 space-y-2 overflow-y-scroll w-4/5 h-[80vh]'>
        <ChatBubble message={null} />
      </div>
        <form action="" className='flex flex-row space-x-5 w-full justify-center'>
          <Input type='text' className='max-w-7xl' placeholder='Enter Message'/>
          <Button type='submit'>
            <SendHorizontal />
          </Button>
        </form>
    </div>
  )
}
