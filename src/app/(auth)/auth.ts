import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth, { AuthOptions, } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.prisma = new PrismaClient()

export const authoOptions:AuthOptions = {
  debug: true,
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c?.password !== "password") return null
        return {
          id: "test",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    GitHub,
    Google,
  ].filter(Boolean) as AuthOptions["providers"],
}


export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  adapter: PrismaAdapter(globalThis.prisma),
  session: { strategy: "jwt" },
  ...authoOptions,
})