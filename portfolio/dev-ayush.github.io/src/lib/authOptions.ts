import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = (profile as any).email
        token.name = (profile as any).name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || { name: '', email: '' }
        session.user.email = (token as any).email || session.user.email
        session.user.name = (token as any).name || session.user.name
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-me'
}
