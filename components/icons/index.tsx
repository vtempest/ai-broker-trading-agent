"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
}

function createIconComponent(src: string, alt: string) {
  return function IconComponent({ className }: IconProps) {
    return (
      <Image
        src={src}
        alt={alt}
        width={24}
        height={24}
        className={cn("w-6 h-6 shrink-0", className)}
        unoptimized
      />
    )
  }
}

// Trade icons
export const GraphChartIcon = createIconComponent("/icons/icon-graph-chart.svg", "Graph Chart")
export const PredictCheckboxesIcon = createIconComponent("/icons/icon-predict-checkboxes.svg", "Prediction Markets")

// Signal icons
export const MarketScreenerIcon = createIconComponent("/icons/icon-market-screener.svg", "Market Screener")
export const CopyTradeIcon = createIconComponent("/icons/icon-copy-trade.png", "Copy Trade")

// Portfolio icons
export const IndicatorsIcon = createIconComponent("/icons/icon-indicators.png", "Indicators")

// Settings icons
export const SettingsIcon = createIconComponent("/icons/icon-settings.svg", "Settings")
export const UserGuideIcon = createIconComponent("/icons/icon-user-guide.svg", "User Guide")

// Additional icons
export const AlgoStrategiesIcon = createIconComponent("/icons/icon-algo-strategies.svg", "Algo Strategies")
export const ChartDollarIcon = createIconComponent("/icons/icon-chart-dollar.svg", "Chart Dollar")
export const ChartFutureIcon = createIconComponent("/icons/icon-chart-future.svg", "Chart Future")
export const DashLaptopIcon = createIconComponent("/icons/icon-dash-laptop.svg", "Dashboard")
export const DebateTwoPeopleIcon = createIconComponent("/icons/icon-debate-two-people.svg", "Debate")
export const EventFuturesIcon = createIconComponent("/icons/icon-event-futures.svg", "Event Futures")
export const FilesStorageIcon = createIconComponent("/icons/icon-files-storage.svg", "Files Storage")
export const GrowthChartIcon = createIconComponent("/icons/icon-growth-chart.svg", "Growth Chart")
export const LoginIcon = createIconComponent("/icons/icon-login.svg", "Login")
export const PresentationIcon = createIconComponent("/icons/icon-presentation.svg", "Presentation")
export const ResearchAgentsIcon = createIconComponent("/icons/icon-research-agents.svg", "Research Agents")
export const ResearchMindIcon = createIconComponent("/icons/icon-research-mind.svg", "Research Mind")
export const ThemesIcon = createIconComponent("/icons/icon-themes.svg", "Themes")
export const TopTradersIcon = createIconComponent("/icons/icon-top-traders.png", "Top Traders")
export const CorrelateStatisticsIcon = createIconComponent("/icons/icon-correlate-statistics.png", "Correlate Statistics")
export const PredictionMarketsIcon = createIconComponent("/icons/icon-prediction-markets.png", "Prediction Markets")
