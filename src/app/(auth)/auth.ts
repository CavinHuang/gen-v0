import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { NextAuthConfig, } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { prisma } from "@/lib/prisma";

import { comparePassword, initUserSettings } from "@/app/(auth)/signin/action";
import { LoginFormSchemaType } from "@/app/(auth)/signin/login";

export const authoOptions:NextAuthConfig = {
  debug: true,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        const {email, password} = credentials as LoginFormSchemaType;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user || !user.password) return null;

        if ( !(await comparePassword(password, user.password)) ) {
          return null;
        }

        return user;
      },
    }),
    GitHub,
    Google,
  ].filter(Boolean) as NextAuthConfig["providers"],
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  ...authoOptions,
  callbacks: {
    jwt: async ({token}) => {
      return token;
    },
    session: async ({session, token}) => {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    createUser: async (message) => {
      if (message.user.id) {
        await initUserSettings(message.user.id);
      }
    }
  }
})