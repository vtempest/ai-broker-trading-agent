"use client"

import { useRouter } from 'next/navigation'
import Dock from "@/components/ui/dock"
import {
  GraphChartIcon,
  PredictCheckboxesIcon,
  MarketScreenerIcon,
  CopyTradeIcon,
  IndicatorsIcon,
} from "@/components/icons"

const navigationGroups = [
  {
    title: "Trade",
    items: [
      { name: "Stocks", href: "/stock", icon: GraphChartIcon },
      { name: "Predict", href: "/predict", icon: PredictCheckboxesIcon },
    ],
  },
  {
    title: "Signal",
    items: [
      { name: "Watch", href: "/markets", icon: MarketScreenerIcon },
      { name: "Copy", href: "/leaders", icon: CopyTradeIcon },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { name: "Portfolio", href: "/portfolio", icon: IndicatorsIcon },
    ],
  },
]

export function MobileDock() {
  const router = useRouter()

  const dockItems = navigationGroups.flatMap(group =>
    group.items.map(item => ({
      icon: item.icon,
      label: item.name,
      onClick: () => router.push(item.href),
    }))
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-sm border-t">
      <Dock items={dockItems} className="py-2" />
    </div>
  )
}
