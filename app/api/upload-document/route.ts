import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: Request) {
  
  const session = getServerSession(authOptions);
  const formData = await request.formData();
  
  return Response.json({ })
}