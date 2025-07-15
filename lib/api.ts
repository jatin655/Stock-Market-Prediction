import type { StockData, MarketData } from "@/types/stock"

const API_KEY = "7696b7bb38974a72afa6d192b3c76282"
const BASE_URL = "https://api.twelvedata.com"

// Cache management
interface CacheItem<T> {
  data: T
  timestamp: number
}

const cache: Record<string, CacheItem<any>> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1200 // 1.2 seconds between requests
let creditUsageThisMinute = 0
let lastCreditResetTime = Date.now()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Reset credit counter every minute
setInterval(() => {
  creditUsageThisMinute = 0
  lastCreditResetTime = Date.now()
  console.log("API credit usage reset")
}, 60000)

async function makeRequest(url: string, creditCost = 1): Promise<any> {
  const cacheKey = url
  const now = Date.now()

  // Check cache first
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`Using cached data for: ${url.split("?")[0]}`)
    return cache[cacheKey].data
  }

  // Check if we're about to exceed credit limit (8 per minute)
  if (creditUsageThisMinute + creditCost > 7) {
    // Leave 1 credit buffer
    const timeUntilReset = 60000 - (now - lastCreditResetTime)
    if (timeUntilReset > 0) {
      console.log(`Credit limit approaching. Waiting ${timeUntilReset}ms before next request`)
      await delay(timeUntilReset)
      // After waiting, our credits should be reset
      creditUsageThisMinute = 0
    }
  }

  // Implement rate limiting
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }

  lastRequestTime = Date.now()
  creditUsageThisMinute += creditCost
  console.log(`Making API request: ${url.split("?")[0]} (Credits used this minute: ${creditUsageThisMinute})`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === "error") {
      throw new Error(data.message || "API returned an error")
    }

    // Cache the successful response
    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error(`API request failed: ${error}`)
    throw error
  }
}

export async function fetchStockData(symbol: string, interval = "5min", outputsize = 100): Promise<StockData[]> {
  try {
    const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`

    console.log(`Fetching data for ${symbol}...`)
    const data = await makeRequest(url, 1) // Time series costs 1 credit

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error("Invalid data format received from API")
    }

    // Convert API data to our format
    const stockData: StockData[] = data.values
      .map((item: any) => ({
        date: item.datetime,
        price: Number.parseFloat(item.close),
        open: Number.parseFloat(item.open),
        high: Number.parseFloat(item.high),
        low: Number.parseFloat(item.low),
        volume: Number.parseInt(item.volume) || 0,
      }))
      .filter((item: StockData) => !isNaN(item.price) && item.price > 0)
      .reverse() // Reverse to get chronological order

    if (stockData.length === 0) {
      throw new Error("No valid data points received")
    }

    console.log(`Successfully loaded ${stockData.length} data points for ${symbol}`)
    return stockData
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error)
    throw new Error(`Failed to fetch ${symbol} data: ${(error as Error).message}`)
  }
}

export async function fetchMultipleStocks(symbols: string[]): Promise<MarketData[]> {
  if (symbols.length === 0) return []

  // Limit to max 5 symbols to conserve credits
  const limitedSymbols = [...new Set(symbols)].slice(0, 5)
  const url = `${BASE_URL}/quote?symbol=${limitedSymbols.join(",")}&apikey=${API_KEY}`

  try {
    // Cost is 1 credit for the batch request
    const raw = await makeRequest(url, 1)

    // TwelveData returns an array when fetching multiple symbols,
    // and an object when only one symbol is requested
    const items = Array.isArray(raw) ? raw : [raw]

    return items.map(
      (d: any): MarketData => ({
        symbol: d.symbol,
        name: d.name ?? d.symbol,
        price: Number.parseFloat(d.close),
        change: Number.parseFloat(d.change) || 0,
        changePercent: Number.parseFloat(d.percent_change) || 0,
        volume: Number.parseInt(d.volume) || 0,
        marketCap: 0,
        lastUpdated: new Date().toISOString(),
      }),
    )
  } catch (error) {
    console.error("Error (batched) fetchMultipleStocks:", error)
    return [] // graceful fallback
  }
}

// Clear cache function that can be called externally
export function clearApiCache() {
  Object.keys(cache).forEach((key) => delete cache[key])
  console.log("API cache cleared")
}

// Get cache stats for debugging
export function getCacheStats() {
  return {
    cacheSize: Object.keys(cache).length,
    creditUsageThisMinute,
    timeUntilReset: 60000 - (Date.now() - lastCreditResetTime),
  }
}
