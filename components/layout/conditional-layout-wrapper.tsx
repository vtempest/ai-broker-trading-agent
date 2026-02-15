"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileDock } from "@/components/layout/mobile-dock"
import { StockTicker } from "@/components/investing/stock-ticker"
import { Toaster } from "sonner"

export function ConditionalLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDocsPage = pathname.startsWith("/docs")

  if (isDocsPage) {
    // Docs pages use their own layout without app sidebar
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    )
  }

  // Other pages use the app sidebar
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="md:pb-0 overflow-x-hidden">
        <StockTicker fixed="top" />
        {children}
      </SidebarInset>
      <MobileDock />
      <Toaster position="top-right" />
    </SidebarProvider>
  )
}
