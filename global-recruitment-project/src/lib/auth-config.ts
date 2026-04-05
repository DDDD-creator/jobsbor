import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { UserRole } from "@prisma/client"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma) as any, // @auth/prisma-adapter 与 next-auth 类型版本差异
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7天
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            jobSeekerProfile: true,
            recruiterProfile: {
              include: { company: true }
            }
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          hasProfile: user.role === "JOBSEEKER" 
            ? !!user.jobSeekerProfile 
            : !!user.recruiterProfile,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.hasProfile = user.hasProfile
      }
      
      // 支持更新session
      if (trigger === "update" && session) {
        token.name = session.name
        token.hasProfile = session.hasProfile
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.hasProfile = token.hasProfile as boolean
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`[Auth] User ${user.email} signed in`)
    },
  },
})

// 扩展next-auth类型
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      hasProfile: boolean
    }
  }

  interface User {
    role: UserRole
    hasProfile: boolean
  }
}
