import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import { serverEnv } from "./env";
import { prisma } from "~/lib/prisma";
import { cookies } from "next/headers";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user, ...rest }) => {
      if (session) {
        session.user = {
          ...session.user,
        };
      }

      return {
        ...session,
        user: {
          ...session.user,
          ...user,
        },
      };
    },
  },
};

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export async function getServerUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
