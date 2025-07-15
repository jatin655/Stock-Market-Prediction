"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, TrendingDown, RefreshCw, Snowflake, Sparkles } from "lucide-react"
import Header from "@/components/header"
import StockChart from "@/components/stock-chart"
import PredictionResults from "@/components/prediction-results"
import DataUploader from "@/components/data-uploader"
import Footer from "@/components/footer"
import StockSelector from "@/components/stock-selector"
import type { StockData, PredictionResult } from "@/types/stock"
import { trainStockModel, predictNextPrice } from "@/lib/brain-model"
import { fetchStockData, clearApiCache } from "@/lib/api"

export default function StockPredictionApp() {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [isLoading, setIsLoading] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [model, setModel] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [daysToPredict, setDaysToPredict] = useState(5)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Popular stocks for selection
  const popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]

  // Load stock data function
  const loadStockData = useCallback(
    async (symbol: string, showLoading = true) => {
      if (showLoading) setIsLoading(true)
      setError("")

      try {
        const data = await fetchStockData(symbol)
        setStockData(data)
        setLastUpdated(new Date())

        // Reset model and prediction when changing stocks
        if (symbol !== selectedSymbol) {
          setModel(null)
          setPrediction(null)
        }
      } catch (err) {
        setError(`Failed to load ${symbol} data: ${(err as Error).message}`)
      } finally {
        if (showLoading) setIsLoading(false)
      }
    },
    [selectedSymbol],
  )

  // Load initial data
  useEffect(() => {
    loadStockData(selectedSymbol)
  }, [selectedSymbol, loadStockData])

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    if (isRefreshing) return

    setIsRefreshing(true)
    clearApiCache()

    loadStockData(selectedSymbol).finally(() => {
      setIsRefreshing(false)
    })
  }, [isRefreshing, selectedSymbol, loadStockData])

  const handleStockChange = (symbol: string) => {
    if (symbol === selectedSymbol) return
    setSelectedSymbol(symbol)
    setModel(null)
    setPrediction(null)
    setError("")
  }

  const handleTrainModel = async () => {
    if (stockData.length < 20) {
      setError("Need at least 20 data points to train the neural network")
      return
    }

    setIsTraining(true)
    setError("")

    try {
      const trainedModel = await trainStockModel(stockData)
      setModel(trainedModel)
      const result = predictNextPrice(trainedModel, stockData, daysToPredict)
      setPrediction(result)
    } catch (err) {
      setError("Failed to train model: " + (err as Error).message)
    } finally {
      setIsTraining(false)
    }
  }

  const handlePredict = () => {
    if (!model) {
      setError("Please train the model first")
      return
    }

    try {
      const result = predictNextPrice(model, stockData, daysToPredict)
      setPrediction(result)
      setError("")
    } catch (err) {
      setError("Prediction failed: " + (err as Error).message)
    }
  }

  const handleDataUpload = (newData: StockData[]) => {
    setStockData(newData)
    setModel(null)
    setPrediction(null)
    setError("")
    setLastUpdated(new Date())
  }

  const currentPrice = stockData[stockData.length - 1]?.price || 0
  const predictedPrice = prediction?.predictedPrice || 0
  const trend = predictedPrice > currentPrice ? "up" : "down"
  const trendPercentage = currentPrice > 0 ? ((predictedPrice - currentPrice) / currentPrice) * 100 : 0

  // Calculate daily change (avoid NaN)
  const dailyChange =
    stockData.length >= 2 && stockData[stockData.length - 1]?.price && stockData[stockData.length - 2]?.price
      ? stockData[stockData.length - 1].price - stockData[stockData.length - 2].price
      : 0

  const dailyChangePercent =
    stockData.length >= 2 && stockData[stockData.length - 2]?.price && stockData[stockData.length - 2].price > 0
      ? (dailyChange / stockData[stockData.length - 2].price) * 100
      : 0

  return (
    <div className="min-h-screen relative">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10" style={{ paddingTop: "120px" }}>
        {/* Hero Section */}
        <div id="dashboard" className="text-center space-y-6 py-16 animate-fade-in">
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-bold text-crystalline mb-4 animate-frost-breath">
              CrystalStock AI
            </h1>
            <div className="absolute -top-4 -right-4 animate-ice-drift">
              <Snowflake className="h-8 w-8 text-sky-400 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div className="absolute -bottom-2 -left-4 animate-ice-drift" style={{ animationDelay: "-3s" }}>
              <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
            </div>
          </div>
          <p className="text-xl text-sky-700 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Experience the tranquil power of ethereal market analysis. Our crystalline AI platform brings serene
            precision to stock predictions through advanced neural networks in a mystical, calming environment.
          </p>
          <div className="flex justify-center gap-6 pt-6">
            <div className="flex items-center gap-3 px-6 py-3 glass-ethereal rounded-full shadow-2xl animate-bounce-subtle floating-element">
              <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-sky-700">Ethereal Analytics</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 glass-ethereal rounded-full shadow-2xl animate-bounce-subtle delay-100 floating-element">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-sky-700">Crystal AI</span>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-3 px-6 py-3 glass-ethereal rounded-full shadow-2xl animate-bounce-subtle delay-200 floating-element">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-sky-700">Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Manual refresh button */}
          <div className="pt-6">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="crystalline-button px-8 py-3 text-lg font-semibold mystical-glow"
            >
              <RefreshCw className={`h-5 w-5 mr-3 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>

        {/* Stock Selector */}
        <StockSelector
          selectedSymbol={selectedSymbol}
          onSymbolChange={handleStockChange}
          onRefresh={handleRefresh}
          isLoading={isLoading || isRefreshing}
          currentPrice={currentPrice}
          dailyChange={dailyChange}
          dailyChangePercent={dailyChangePercent}
          lastUpdated={lastUpdated}
          popularStocks={popularStocks}
        />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-shake glass-ethereal border-red-400/50 text-red-700">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="animate-pulse ethereal-card animate-ethereal-glow">
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin mr-4 text-sky-500" />
              <span className="text-xl text-sky-700">Loading ethereal market data...</span>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!isLoading && stockData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-8 animate-slide-in-left">
              {/* Data Management */}
              <Card className="ethereal-card animate-ethereal-glow">
                <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">📊</div>
                    Data Management
                  </CardTitle>
                  <CardDescription className="text-sky-100">
                    Ethereal data from Twelve Data API ({stockData.length} points)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 glass-frost">
                  <DataUploader onDataUpload={handleDataUpload} />
                  <div className="mt-6 p-4 glass-ethereal rounded-xl border border-sky-400/30">
                    <p className="text-sm text-sky-700 font-medium">❄️ Crystal Data Active</p>
                    <p className="text-xs text-sky-600 mt-1">Real-time {selectedSymbol} data from Twelve Data API</p>
                    <p className="text-xs text-sky-600 mt-1">Crystalline caching for optimal serenity</p>
                  </div>
                </CardContent>
              </Card>

              {/* Model Training */}
              <Card id="models" className="ethereal-card animate-ethereal-glow">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">🧠</div>
                    Neural Network Training
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Crystalline AI model with ethereal {selectedSymbol} data
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6 glass-frost">
                  <div className="space-y-3">
                    <Label htmlFor="days" className="text-sky-700 font-medium">
                      Days to Predict
                    </Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="30"
                      value={daysToPredict}
                      onChange={(e) => setDaysToPredict(Number(e.target.value))}
                      className="glass-ethereal border-sky-400/30 text-sky-800 focus:border-sky-500 transition-all duration-200 focus:scale-105"
                    />
                  </div>

                  <Button
                    onClick={handleTrainModel}
                    disabled={isTraining || stockData.length < 20}
                    className="w-full crystalline-button py-4 text-lg font-semibold mystical-glow"
                  >
                    {isTraining ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Training Crystal Network...
                      </>
                    ) : (
                      "❄️ Train Ethereal AI Model"
                    )}
                  </Button>

                  {model && (
                    <Button
                      onClick={handlePredict}
                      variant="outline"
                      className="w-full bg-transparent border-sky-400/50 text-sky-700 hover:bg-sky-50/50 hover:border-sky-500 transition-all duration-300 transform hover:scale-105 py-4 mystical-glow"
                    >
                      🔮 Generate New Prediction
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Live Stats */}
              <Card id="analytics" className="ethereal-card animate-ethereal-glow">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">📈</div>
                    Live {selectedSymbol} Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 glass-frost">
                  <div className="flex justify-between items-center p-4 glass-ethereal rounded-xl border border-sky-400/30">
                    <span className="text-sm text-sky-600">Data Points:</span>
                    <span className="font-bold text-sky-700 animate-pulse text-lg">{stockData.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 glass-ethereal rounded-xl border border-emerald-400/30">
                    <span className="text-sm text-emerald-600">Current Price:</span>
                    <span className="font-bold text-emerald-700 text-lg">${currentPrice.toFixed(2)}</span>
                  </div>
                  {!isNaN(dailyChange) && !isNaN(dailyChangePercent) && (
                    <div className="flex justify-between items-center p-4 glass-ethereal rounded-xl border border-blue-400/30">
                      <span className="text-sm text-blue-600">Daily Change:</span>
                      <div className="flex items-center gap-2">
                        {dailyChange >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`font-bold ${dailyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          ${Math.abs(dailyChange).toFixed(2)} ({dailyChangePercent >= 0 ? "+" : ""}
                          {dailyChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  )}
                  {prediction && !isNaN(predictedPrice) && !isNaN(trendPercentage) && (
                    <>
                      <div className="flex justify-between items-center p-4 glass-ethereal rounded-xl border border-purple-400/30">
                        <span className="text-sm text-purple-600">AI Prediction:</span>
                        <span className="font-bold text-purple-700 text-lg">${predictedPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 glass-ethereal rounded-xl border border-indigo-400/30">
                        <span className="text-sm text-indigo-600">Predicted Trend:</span>
                        <div className="flex items-center gap-2">
                          {trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-emerald-600 animate-bounce" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 animate-bounce" />
                          )}
                          <span
                            className={`font-bold ${trend === "up" ? "text-emerald-600" : "text-red-500"} animate-pulse`}
                          >
                            {trendPercentage > 0 ? "+" : ""}
                            {trendPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Visualization */}
            <div className="lg:col-span-2 space-y-8 animate-slide-in-right">
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-2 glass-crystal border border-sky-300/50">
                  <TabsTrigger
                    value="chart"
                    className="text-sky-700 data-[state=active]:bg-sky-100/50 data-[state=active]:text-sky-900 transition-all duration-200 hover:scale-105"
                  >
                    📊 Ethereal Chart
                  </TabsTrigger>
                  <TabsTrigger
                    value="prediction"
                    className="text-sky-700 data-[state=active]:bg-sky-100/50 data-[state=active]:text-sky-900 transition-all duration-200 hover:scale-105"
                  >
                    🎯 AI Predictions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chart">
                  <Card className="ethereal-card animate-ethereal-glow">
                    <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">📈</div>
                        {selectedSymbol} Ethereal Price Chart
                      </CardTitle>
                      <CardDescription className="text-sky-100">
                        Real-time crystalline data with mystical AI predictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 glass-frost">
                      <StockChart data={stockData} prediction={prediction} symbol={selectedSymbol} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="prediction" id="predictions">
                  <PredictionResults prediction={prediction} isModelTrained={!!model} symbol={selectedSymbol} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
