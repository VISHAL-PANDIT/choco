import GoogleProvider from "next-auth/providers/google";
import { db } from "../db/db";
import { users } from "../db/schema";
import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    }
  }
  interface User {
    id: string;
    role: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile) {
        console.log(profile);

        const data = {
          fname: profile.given_name,
          lname: profile.family_name,
          email: profile.email,
          provider: "GOOGLE",
          externalId: profile.sub,
          image: profile.picture,
        };

        try {
          const user = await db
            .insert(users)
            .values(data)
            .onConflictDoUpdate({ target: users.email, set: data })
            .returning();

          return {
            id: user[0].id.toString(),
            role: user[0].roll,
            name: data.fname,
            email: data.email,
            image: data.image,
          };
        } catch (error) {
          console.log(error);
          return {
            id: "",
            role: "customer",
            name: "",
            email: "",
            image: "",
          };
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    }
  }
};
