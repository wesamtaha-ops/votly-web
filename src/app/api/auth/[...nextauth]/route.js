import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        try {
          const res = await axios.post(`https://staging.votly.app/api/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (res.data.token) {
            return {
              id: res.data.token,
              user: res.data.user,
            };
          }
        } catch (error) {
          console.log("Login failed:", error);
        }

        return null; // Return null if login fails
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.user = user.user;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.id = token.id;
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
