import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const documents = await prisma.userDocuments.findMany({
    where: {
      userId: session?.user.id
    }
  });
  return Response.json({documents});
}