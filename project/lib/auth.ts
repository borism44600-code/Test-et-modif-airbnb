import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Admin users - In production, this would come from a database
// Passwords are hashed using bcrypt
const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@marrakechriads.com",
    name: "Admin User",
    // Password: "admin123" - In production, use strong passwords and store hashed in DB
    passwordHash: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNBqKq",
    role: "admin" as const,
  },
  {
    id: "2", 
    email: "editor@marrakechriads.com",
    name: "Editor User",
    // Password: "editor123"
    passwordHash: "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa",
    role: "editor" as const,
  },
]

export type UserRole = "admin" | "editor"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
}

declare module "next-auth" {
  interface User {
    role?: UserRole
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole
    id?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole
        session.user.id = token.id as string
      }
      return session
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
      const isLoginPage = request.nextUrl.pathname === "/admin/login"

      if (isLoginPage) {
        if (isLoggedIn) {
          // Redirect to admin dashboard if already logged in
          return Response.redirect(new URL("/admin", request.nextUrl))
        }
        return true
      }

      if (isAdminRoute) {
        if (!isLoggedIn) {
          // Redirect to login if not authenticated
          return Response.redirect(new URL("/admin/login", request.nextUrl))
        }
        return true
      }

      return true
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Find user by email
        const user = ADMIN_USERS.find((u) => u.email === email)
        if (!user) {
          return null
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
})

// Helper function to check if user has required role
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  if (requiredRole === "editor") {
    return userRole === "admin" || userRole === "editor"
  }
  return userRole === requiredRole
}

// Helper to hash passwords (for creating new admin users)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
