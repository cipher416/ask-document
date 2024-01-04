'use client'; 
import { Avatar } from "./ui/avatar";
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
        <div className="inline-block align-middle max-w-[50vw]">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </div>
      </div>
      <Separator/>
    </>
  )
}