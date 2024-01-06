"use client";

import ChatBubble from '@/components/ui/chatbubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'



export default function Chat({ params }: { params: { id: string } }) {
  return (
    <div className='flex flex-col justify-center items-center space-y-2'>
      <div className='flex flex-col p-10 space-y-2 overflow-y-scroll w-4/5 h-[80dvh] '>
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
