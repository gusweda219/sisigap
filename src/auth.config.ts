import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60,
  },
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;
      const isOnDashboard =
        nextUrl.pathname.startsWith("/data-pegawai") ||
        nextUrl.pathname.startsWith("/data-tunjangan") ||
        nextUrl.pathname.startsWith("/data-potongan") ||
        nextUrl.pathname.startsWith("/slip-gaji");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn || nextUrl.pathname === "/") {
        return Response.redirect(new URL("/data-pegawai", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user,
        };
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: (token as any).user,
      };
    },
  },
} satisfies NextAuthConfig;
