import prisma from "@/lib/db"; 

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const documentId = params.id;
  let document = await prisma.userDocuments.findFirst({
    where: {
      id: documentId
    }, 
  });
  return Response.json(document);
}