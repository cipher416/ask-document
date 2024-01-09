import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import Auth0Provider from "next-auth/providers/auth0";
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";

export const authOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient), 
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