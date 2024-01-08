'use client'; 
import { Avatar, AvatarFallback } from "./avatar";
import { AvatarImage } from "./avatar";

import type { Message } from "ai/react";
import { useSession } from "next-auth/react";
import { Separator } from "./separator";

type ChatBubbleProps = {
  message: Message 
}

export default function ChatBubble({message}: ChatBubbleProps) {
  const {data} = useSession();
  return (
    <>
      <div className="flex flex-row p-5 space-x-10">
        <Avatar>
          {message.role === "user" ? <AvatarImage src={
            data?.user?.image!
            }/> 
            :
            <AvatarFallback>Bot</AvatarFallback>}
        </Avatar>
        <div className="inline-block align-middle max-w-[50vw]">
            {message!.content}
        </div>
      </div>
      <Separator/>
    </>
  )
}