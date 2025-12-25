import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import axios from "axios";
import { callVotlyApi } from "../../../helper";

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
          console.log('=== NextAuth AUTHORIZE CALLED ===');
          console.log('Login credentials:', { 
            email: credentials.email, 
            lang: credentials.lang,
            hasPassword: !!credentials.password 
          });
          
          // Call backend API directly using helper function
          // This avoids HTTP calls and uses the correct BACKEND_BASE_URL_API
          console.log('Calling backend API: v2/login');
          
          const res = await callVotlyApi({
            type: "post",
            url: "v2/login",
            data: {
              email: credentials.email,
              password: credentials.password,
              lang: credentials.lang,
            },
            userToken: undefined, // No token needed for login
            lang: credentials.lang,
          });

          console.log('Backend response:', JSON.stringify(res, null, 2));

          // Check if response has token (backend format)
          const token = res?.token || res?.data?.token;
          const user = res?.user || res?.data?.user;

          if (token) {
            console.log('Login successful, token received:', token.substring(0, 20) + '...');
            console.log('User data:', user);
            console.log('=== NextAuth AUTHORIZE SUCCESS ===');
            return {
              id: token,
              user: user,
            };
          } else {
            console.log('Login failed: No token in response');
            console.log('=== NextAuth AUTHORIZE FAILED (no token) ===');
          }
        } catch (error) {
          console.error("=== NextAuth AUTHORIZE ERROR ===");
          console.error("Error message:", error.message);
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
          console.error("Error config:", {
            url: error.config?.url,
            method: error.config?.method,
          });
          console.error("=== NextAuth AUTHORIZE ERROR END ===");
          
          throw new Error(
            "Login failed: " + (error.response?.data?.message || error.message)
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

      console.log('=== NextAuth SESSION CALLBACK ===');
      console.log('Token ID:', token.id?.substring(0, 20) + '...');

      try {
        // Call backend API directly using helper function
        console.log('Calling backend API: user');
        
        const userData = await callVotlyApi({
          type: "get",
          url: "user",
          data: {},
          userToken: token.id,
          lang: 'en',
        });

        console.log('GetUser API response:', userData);
        session.user = userData;
      } catch (error) {
        console.error('=== NextAuth SESSION ERROR ===');
        console.error('GetUser API error:', error.response?.data || error.message);
        console.error('Error status:', error.response?.status);
        console.error('=== NextAuth SESSION ERROR END ===');
        // Don't fail the session, just log the error
      }

      console.log('=== NextAuth SESSION CALLBACK COMPLETE ===');
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
