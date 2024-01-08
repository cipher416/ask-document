import prisma from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions = {
  adapter: PrismaAdapter(prisma), 
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
    }),
  ],
  callbacks: {
    async session({session, token, user}) {
        session.user!.id = user.id;
        return Promise.resolve(session);
    },
  }
} satisfies NextAuthOptions

const handler = NextAuth(authOptions);



export { handler as GET, handler as POST }

