import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/options";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const documents = await prisma.userDocuments.findMany({
    where: {
      userId: session?.user.id
    }
  });
  return Response.json({documents});
}