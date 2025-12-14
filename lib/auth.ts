import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { siwe } from "better-auth/plugins"
import { db } from "./db"
import * as schema from "./db/schema"
import { verifyMessage } from "ethers"
import { randomBytes } from "crypto"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  anonymous: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + "/api/auth/callback/google",
    },
  },
  plugins: [
    siwe({
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000",
      anonymous: true, // Allow anonymous wallet connections
      getNonce: async () => {
        // Generate a cryptographically secure random nonce
        return randomBytes(32).toString("hex")
      },
      verifyMessage: async ({ message, signature, chainId }) => {
        try {
          // Verify the signed SIWE message
          const recovered = verifyMessage(message, signature)

          // Additional validation: check chainId if needed
          // Allow Ethereum mainnet (1), Sepolia testnet (11155111), or any other chains
          // You can restrict this to specific chains in production
          if (chainId && chainId !== 1 && chainId !== 11155111 && chainId !== 31337) {
            // Only allow Ethereum mainnet (1), Sepolia testnet (11155111), or localhost (31337)
            console.warn(`Unsupported chain ID: ${chainId}`)
            // For now, we'll allow all chains - remove this line to enforce restrictions
            // return false
          }

          return !!recovered
        } catch (error) {
          console.error("Message verification failed:", error)
          return false
        }
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
