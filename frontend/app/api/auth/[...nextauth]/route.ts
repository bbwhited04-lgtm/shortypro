import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Optional: keep email always available
    async session({ session, user }) {
      if (session.user) {
        session.user.email = user.email;
        // @ts-ignore
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
