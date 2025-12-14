"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { authClient, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2, Wallet } from "lucide-react"
import { BrowserProvider } from "ethers"

export function MetaMaskSignIn() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard")
    }
    if (typeof window !== "undefined") {
      setHasMetaMask(!!window.ethereum)
    }
  }, [session, router])

  const handleMetaMaskLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError("MetaMask not installed. Please install MetaMask to continue.")
        window.open("https://metamask.io/download/", "_blank")
        return
      }

      // Request wallet connection
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const walletAddress = await signer.getAddress()
      const chainId = Number((await provider.getNetwork()).chainId)

      // Step 1: Get nonce from backend
      const nonceResponse = await fetch("/api/auth/siwe/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, chainId }),
      })

      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce")
      }

      const { nonce } = await nonceResponse.json()

      // Step 2: Create SIWE message
      const domain = window.location.hostname
      const origin = window.location.origin
      const message = `${domain} wants you to sign in with your Ethereum account:
${walletAddress}

Sign in with Ethereum to authenticate.

URI: ${origin}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`

      // Step 3: Sign message with MetaMask
      const signature = await signer.signMessage(message)

      // Step 4: Verify signature on backend
      const verifyResponse = await authClient.siwe.verify({
        message,
        signature,
        address: walletAddress,
        chainId,
      })

      if (verifyResponse.error) {
        throw new Error(verifyResponse.error.message || "Verification failed")
      }

      // Success - redirect to dashboard
      router.push("/dashboard")

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (session?.user) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleMetaMaskLogin}
        size="lg"
        className="w-full"
        disabled={loading || !hasMetaMask}
        variant="outline"
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wallet className="mr-2 h-5 w-5" />
        )}
        {hasMetaMask ? "Sign in with MetaMask" : "Install MetaMask"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!hasMetaMask && (
        <p className="text-muted-foreground text-xs text-center">
          MetaMask extension not detected. Click above to install.
        </p>
      )}
    </div>
  )
}
