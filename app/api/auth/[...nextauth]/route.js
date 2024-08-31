import axios from "axios";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

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
          const res = await axios(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}login`,
            {
              method: "post",
              data: {
                email: credentials.email,
                password: credentials.password,
              },
            }
          );

          if (res.data.token) {
            return {
              id: res.data.token,
              user: res.data.user,
            };
          }
        } catch (error) {
          console.log(error);
        }

        // login failed
        return null;
      },
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.user = user.user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.user = token.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
