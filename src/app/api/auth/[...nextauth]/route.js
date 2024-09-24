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
        console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL_API);

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            }
          );

          if (res.data.token) {
            return {
              id: res.data.token,
              user: res.data.user,
            };
          }
        } catch (error) {
          console.log("Login failed:", error.response?.data || error.message);
          throw new Error(
            "Login failed: " + (error.response?.data.message || error.message)
          );
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
    session: async ({ session, token }) => {
      session.id = token.id;

      const response = await axios(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}getUser`,
        {
          method: "get",
          headers: { userToken: token.id },
        }
      );

      console.log("session update", response.data);

      session.user = response.data;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
