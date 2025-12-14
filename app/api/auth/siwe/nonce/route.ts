import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { address, chainId } = await request.json()

    if (!address || !chainId) {
      return NextResponse.json(
        { error: "Missing address or chainId" },
        { status: 400 }
      )
    }

    // Generate cryptographically secure nonce
    const nonce = randomBytes(32).toString("hex")

    // In production, you should store this nonce temporarily with:
    // 1. The wallet address
    // 2. An expiration time (5-15 minutes)
    // 3. A flag to prevent reuse
    // You can use Redis, a database, or in-memory cache

    // For now, we return the nonce directly
    // The better-auth SIWE plugin will handle nonce validation
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error("Nonce generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate nonce" },
      { status: 500 }
    )
  }
}
