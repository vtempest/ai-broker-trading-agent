"use client"

import {
  GraphChartIcon,
  MarketScreenerIcon,
  CopyTradeIcon,
  PredictCheckboxesIcon,
} from "@/components/icons"

export interface DockNavigationItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

export const dockNavigationItems: DockNavigationItem[] = [
  {
    icon: GraphChartIcon,
    label: "Strategies",
    href: "/stock",
  },
  {
    icon: PredictCheckboxesIcon,
    label: "Futures",
    href: "/predict",
  },
  {
    icon: CopyTradeIcon,
    label: "Copy",
    href: "/leaders",
  },
  {
    icon: MarketScreenerIcon,
    label: "Watchlist",
    href: "/markets",
  },
]
