import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type NextAuthConfig, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { users, accounts, sessions, verificationTokens } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; // Precisaremos instalar bcryptjs

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string; // Adicionando role à sessão
    } & DefaultSession["user"];
  }
  interface User {
    role: string; // Adicionando role ao tipo User
    hashedPassword?: string | null; // Adicionando hashedPassword ao tipo User
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Credenciais incompletas");
          return null;
        }
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.hashedPassword) {
          console.log("Usuário não encontrado ou senha não configurada:", email);
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isValidPassword) {
          console.log("Senha inválida para o usuário:", email);
          return null;
        }
        console.log("Usuário autenticado com sucesso:", email, "Role:", user.role);
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          image: user.image, 
          role: user.role 
        };
      },
    }),
  ],
  // Comentando o adapter para usar apenas JWT
  // adapter: DrizzleAdapter(db, {
  //   usersTable: users,
  //   accountsTable: accounts,
  //   sessionsTable: sessions,
  //   verificationTokensTable: verificationTokens,
  // }),
  session: {
    strategy: "jwt", // Usar JWT para que possamos adicionar a role ao token
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Adicionar role ao token JWT
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Adicionar role à sessão
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Garantir que redirecionamentos internos funcionem corretamente
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permitir redirecionamentos para o mesmo site
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login", // Página de login customizada
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  debug: true, // Ativar logs de debug para diagnóstico
} satisfies NextAuthConfig;
