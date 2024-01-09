import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth"

import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  if (!session){
    redirect('/');
  }
  return (
    <>
      {children}
    </>
  )
}