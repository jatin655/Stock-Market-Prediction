"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Search, TrendingUp, TrendingDown, Clock, Snowflake } from "lucide-react"

interface StockSelectorProps {
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
  onRefresh: () => void
  isLoading: boolean
  currentPrice: number
  dailyChange: number
  dailyChangePercent: number
  lastUpdated: Date | null
  popularStocks?: string[]
}

export default function StockSelector({
  selectedSymbol,
  onSymbolChange,
  onRefresh,
  isLoading,
  currentPrice,
  dailyChange,
  dailyChangePercent,
  lastUpdated,
  popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"],
}: StockSelectorProps) {
  const [customSymbol, setCustomSymbol] = useState("")

  const stockNames: Record<string, string> = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corp.",
    TSLA: "Tesla Inc.",
    AMZN: "Amazon.com Inc.",
    NVDA: "NVIDIA Corp.",
    META: "Meta Platforms Inc.",
    NFLX: "Netflix Inc.",
  }

  const handleCustomSymbol = () => {
    if (customSymbol.trim()) {
      onSymbolChange(customSymbol.trim().toUpperCase())
      setCustomSymbol("")
    }
  }

  return (
    <Card className="ethereal-card animate-slide-up animate-ethereal-glow">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">
              <Snowflake className="h-6 w-6 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            Ethereal Stock Selection
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8 glass-frost">
        {/* Current Stock Display */}
        <div className="glass-crystal rounded-2xl p-8 border border-sky-400/30 shadow-2xl floating-element">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-sky-800">{selectedSymbol}</h3>
              <p className="text-sky-600">{stockNames[selectedSymbol] || "Selected Stock"}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-sky-700">${currentPrice.toFixed(2)}</div>
              {!isNaN(dailyChange) && !isNaN(dailyChangePercent) && (
                <div className="flex items-center gap-2 justify-end mt-2">
                  {dailyChange >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${dailyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    ${Math.abs(dailyChange).toFixed(2)} ({dailyChangePercent >= 0 ? "+" : ""}
                    {dailyChangePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-sky-600">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </div>

        {/* Popular Stocks */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sky-700 text-lg">Crystalline Stocks</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popularStocks.map((stock) => (
              <Button
                key={stock}
                variant={selectedSymbol === stock ? "default" : "outline"}
                size="sm"
                onClick={() => onSymbolChange(stock)}
                className={`transition-all duration-200 hover:scale-105 mystical-glow ${
                  selectedSymbol === stock
                    ? "crystalline-button"
                    : "bg-transparent border-sky-400/50 text-sky-700 hover:bg-sky-50/50 hover:border-sky-500"
                }`}
              >
                {stock}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Symbol Input */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sky-700 text-lg">Custom Symbol</h4>
          <div className="flex gap-3">
            <Input
              placeholder="Enter symbol (e.g., AAPL)"
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleCustomSymbol()}
              className="glass-ethereal border-sky-400/30 text-sky-800 placeholder-sky-500/70 focus:border-sky-500 transition-all duration-200 focus:scale-105"
            />
            <Button
              onClick={handleCustomSymbol}
              disabled={!customSymbol.trim() || isLoading}
              className="crystalline-button px-6 mystical-glow"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* API Status */}
        <div className="glass-ethereal border border-emerald-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700">Twelve Data API Connected</span>
            <Badge variant="outline" className="ml-auto text-emerald-700 border-emerald-400/50">
              ETHEREAL
            </Badge>
          </div>
          <p className="text-xs text-emerald-600 mt-2">
            Crystal-optimized with ethereal caching • Serene refresh available
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
