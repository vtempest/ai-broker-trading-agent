"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2, Wallet } from "lucide-react"
import { BrowserProvider } from "ethers"

declare global {
  interface Window {
    ethereum: any
  }
}

export function SiweSignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSiweSignIn = async () => {
    setIsLoading(true)
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask or another Ethereum wallet!")
        setIsLoading(false)
        return
      }

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      await (signIn as any).siwe({
        signer,
        address,
        callbackURL: "/dashboard",
      })
    } catch (error) {
      console.error("SIWE Error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleSiweSignIn} 
      variant="outline" 
      size="lg" 
      className="w-full" 
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Wallet className="mr-2 h-5 w-5" />
      )}
      Sign in with Ethereum
    </Button>
  )
}
