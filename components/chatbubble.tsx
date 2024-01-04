'use client'; 
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";

import type { Message } from "ai/react";
import { useSession } from "next-auth/react";
import { Separator } from "./ui/separator";

type ChatBubbleProps = {
  message: Message | null
}

export default function ChatBubble({message}: ChatBubbleProps) {
  const {data} = useSession();
  return (
    <>
      <div className="flex flex-row p-5 space-x-10">
        <Avatar>
          <AvatarImage src={
            // message!.role === 'user' ?
            data?.user?.image! 
            //  : ''
            }/> 
        </Avatar>
        <div className="inline-block align-middle">
          asdfasfd
        </div>
      </div>
      <Separator/>
    </>
  )
}