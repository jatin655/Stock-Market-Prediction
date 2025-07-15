import type { StockData, PredictionResult } from "@/types/stock"

// Custom Neural Network Implementation
class Neuron {
  weights: number[]
  bias: number
  output = 0
  delta = 0

  constructor(inputSize: number) {
    // Initialize weights with Xavier/Glorot initialization
    this.weights = Array.from({ length: inputSize }, () => (Math.random() - 0.5) * Math.sqrt(2 / inputSize))
    this.bias = (Math.random() - 0.5) * 0.1
  }

  // Activation functions
  static sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))))
  }

  static sigmoidDerivative(x: number): number {
    return x * (1 - x)
  }

  static relu(x: number): number {
    return Math.max(0, x)
  }

  static reluDerivative(x: number): number {
    return x > 0 ? 1 : 0
  }

  static tanh(x: number): number {
    return Math.tanh(x)
  }

  static tanhDerivative(x: number): number {
    return 1 - x * x
  }

  forward(inputs: number[], activationFunction: "sigmoid" | "relu" | "tanh" = "sigmoid"): number {
    let sum = this.bias
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i]
    }

    switch (activationFunction) {
      case "relu":
        this.output = Neuron.relu(sum)
        break
      case "tanh":
        this.output = Neuron.tanh(sum)
        break
      default:
        this.output = Neuron.sigmoid(sum)
    }

    return this.output
  }
}

class Layer {
  neurons: Neuron[]
  activationFunction: "sigmoid" | "relu" | "tanh"

  constructor(neuronCount: number, inputSize: number, activationFunction: "sigmoid" | "relu" | "tanh" = "sigmoid") {
    this.neurons = Array.from({ length: neuronCount }, () => new Neuron(inputSize))
    this.activationFunction = activationFunction
  }

  forward(inputs: number[]): number[] {
    return this.neurons.map((neuron) => neuron.forward(inputs, this.activationFunction))
  }
}

class NeuralNetwork {
  layers: Layer[]
  learningRate: number
  trainingError = 0
  iterations = 0

  constructor(architecture: number[], learningRate = 0.01) {
    this.layers = []
    this.learningRate = learningRate

    // Create layers
    for (let i = 1; i < architecture.length; i++) {
      const inputSize = i === 1 ? architecture[0] : architecture[i - 1]
      const neuronCount = architecture[i]

      // Use different activation functions for different layers
      let activationFunction: "sigmoid" | "relu" | "tanh" = "relu"
      if (i === architecture.length - 1) {
        // Output layer uses sigmoid for normalized output
        activationFunction = "sigmoid"
      } else if (i === 1) {
        // First hidden layer uses tanh
        activationFunction = "tanh"
      }

      this.layers.push(new Layer(neuronCount, inputSize, activationFunction))
    }
  }

  forward(inputs: number[]): number[] {
    let outputs = inputs
    for (const layer of this.layers) {
      outputs = layer.forward(outputs)
    }
    return outputs
  }

  backward(inputs: number[], expectedOutputs: number[]): void {
    // Forward pass to get current outputs
    const layerOutputs: number[][] = [inputs]
    let currentInputs = inputs

    for (const layer of this.layers) {
      currentInputs = layer.forward(currentInputs)
      layerOutputs.push([...currentInputs])
    }

    // Calculate output layer deltas
    const outputLayer = this.layers[this.layers.length - 1]
    for (let i = 0; i < outputLayer.neurons.length; i++) {
      const neuron = outputLayer.neurons[i]
      const error = expectedOutputs[i] - neuron.output

      let derivative: number
      switch (outputLayer.activationFunction) {
        case "relu":
          derivative = Neuron.reluDerivative(neuron.output)
          break
        case "tanh":
          derivative = Neuron.tanhDerivative(neuron.output)
          break
        default:
          derivative = Neuron.sigmoidDerivative(neuron.output)
      }

      neuron.delta = error * derivative
    }

    // Calculate hidden layer deltas (backpropagation)
    for (let layerIndex = this.layers.length - 2; layerIndex >= 0; layerIndex--) {
      const currentLayer = this.layers[layerIndex]
      const nextLayer = this.layers[layerIndex + 1]

      for (let i = 0; i < currentLayer.neurons.length; i++) {
        const neuron = currentLayer.neurons[i]
        let error = 0

        for (let j = 0; j < nextLayer.neurons.length; j++) {
          error += nextLayer.neurons[j].delta * nextLayer.neurons[j].weights[i]
        }

        let derivative: number
        switch (currentLayer.activationFunction) {
          case "relu":
            derivative = Neuron.reluDerivative(neuron.output)
            break
          case "tanh":
            derivative = Neuron.tanhDerivative(neuron.output)
            break
          default:
            derivative = Neuron.sigmoidDerivative(neuron.output)
        }

        neuron.delta = error * derivative
      }
    }

    // Update weights and biases
    for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
      const layer = this.layers[layerIndex]
      const layerInputs = layerOutputs[layerIndex]

      for (const neuron of layer.neurons) {
        // Update weights
        for (let i = 0; i < neuron.weights.length; i++) {
          neuron.weights[i] += this.learningRate * neuron.delta * layerInputs[i]
        }
        // Update bias
        neuron.bias += this.learningRate * neuron.delta
      }
    }
  }

  train(trainingData: Array<{ input: number[]; output: number[] }>, epochs = 1000, errorThreshold = 0.001): void {
    console.log(`Starting neural network training with ${trainingData.length} samples...`)

    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalError = 0

      // Shuffle training data for better convergence
      const shuffledData = [...trainingData].sort(() => Math.random() - 0.5)

      for (const sample of shuffledData) {
        // Forward and backward pass
        const outputs = this.forward(sample.input)
        this.backward(sample.input, sample.output)

        // Calculate error
        for (let i = 0; i < outputs.length; i++) {
          const error = sample.output[i] - outputs[i]
          totalError += error * error
        }
      }

      this.trainingError = totalError / trainingData.length
      this.iterations = epoch + 1

      // Log progress every 100 epochs
      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}: Error = ${this.trainingError.toFixed(6)}`)
      }

      // Early stopping if error is low enough
      if (this.trainingError < errorThreshold) {
        console.log(`Training converged at epoch ${epoch} with error ${this.trainingError.toFixed(6)}`)
        break
      }
    }

    console.log(`Training completed. Final error: ${this.trainingError.toFixed(6)}, Iterations: ${this.iterations}`)
  }

  predict(inputs: number[]): number[] {
    return this.forward(inputs)
  }
}

/**
 * Normalize data to 0-1 range for better neural network training
 */
function normalizeData(data: number[]): { normalized: number[]; min: number; max: number } {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  const normalized = data.map((value) => (range === 0 ? 0.5 : (value - min) / range))

  return { normalized, min, max }
}

/**
 * Denormalize data back to original scale
 */
function denormalizeValue(normalizedValue: number, min: number, max: number): number {
  return normalizedValue * (max - min) + min
}

/**
 * Create training data sequences for the neural network
 */
function createTrainingData(prices: number[], sequenceLength = 10) {
  const trainingData = []

  for (let i = 0; i < prices.length - sequenceLength; i++) {
    const input = prices.slice(i, i + sequenceLength)
    const output = [prices[i + sequenceLength]]

    trainingData.push({
      input: input,
      output: output,
    })
  }

  return trainingData
}

/**
 * Add technical indicators to improve prediction accuracy
 */
function calculateTechnicalIndicators(stockData: StockData[]): number[][] {
  const prices = stockData.map((d) => d.price)
  const volumes = stockData.map((d) => d.volume || 0)

  const indicators: number[][] = []

  for (let i = 0; i < prices.length; i++) {
    const indicatorSet: number[] = []

    // Simple Moving Averages
    const sma5 = i >= 4 ? prices.slice(i - 4, i + 1).reduce((a, b) => a + b) / 5 : prices[i]
    const sma10 = i >= 9 ? prices.slice(i - 9, i + 1).reduce((a, b) => a + b) / 10 : prices[i]
    const sma20 = i >= 19 ? prices.slice(i - 19, i + 1).reduce((a, b) => a + b) / 20 : prices[i]

    // Price relative to moving averages
    indicatorSet.push(prices[i] / sma5)
    indicatorSet.push(prices[i] / sma10)
    indicatorSet.push(prices[i] / sma20)

    // Volatility (standard deviation of last 10 prices)
    if (i >= 9) {
      const recentPrices = prices.slice(i - 9, i + 1)
      const mean = recentPrices.reduce((a, b) => a + b) / recentPrices.length
      const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / recentPrices.length
      const volatility = Math.sqrt(variance)
      indicatorSet.push(volatility / prices[i]) // Normalized volatility
    } else {
      indicatorSet.push(0)
    }

    // Price momentum (rate of change)
    const momentum = i >= 5 ? (prices[i] - prices[i - 5]) / prices[i - 5] : 0
    indicatorSet.push(momentum)

    // Volume indicator (if available)
    if (volumes[i] > 0) {
      const avgVolume = i >= 9 ? volumes.slice(i - 9, i + 1).reduce((a, b) => a + b) / 10 : volumes[i]
      indicatorSet.push(volumes[i] / avgVolume)
    } else {
      indicatorSet.push(1)
    }

    indicators.push(indicatorSet)
  }

  return indicators
}

/**
 * Train a custom neural network with stock data
 */
export async function trainStockModel(stockData: StockData[]): Promise<any> {
  console.log("Training custom neural network...")

  // Extract prices and calculate technical indicators
  const prices = stockData.map((d) => d.price)
  const technicalIndicators = calculateTechnicalIndicators(stockData)

  // Normalize the price data
  const { normalized: normalizedPrices, min, max } = normalizeData(prices)

  // Create training sequences with technical indicators
  const sequenceLength = 10
  const trainingData = []

  for (let i = sequenceLength; i < normalizedPrices.length; i++) {
    // Input: last 10 normalized prices + technical indicators
    const priceSequence = normalizedPrices.slice(i - sequenceLength, i)
    const indicators = technicalIndicators[i]

    // Normalize technical indicators
    const normalizedIndicators = indicators.map((ind) => Math.max(0, Math.min(1, (ind + 1) / 2))) // Rough normalization

    const input = [...priceSequence, ...normalizedIndicators]
    const output = [normalizedPrices[i]]

    trainingData.push({ input, output })
  }

  if (trainingData.length < 10) {
    throw new Error("Not enough data to create training sequences. Need at least 20 data points.")
  }

  // Create neural network architecture
  // Input: 10 prices + 6 technical indicators = 16 inputs
  // Hidden layers: 32 -> 16 -> 8 neurons
  // Output: 1 neuron (next price)
  const architecture = [16, 32, 16, 8, 1]
  const network = new NeuralNetwork(architecture, 0.01)

  // Train the network
  network.train(trainingData, 2000, 0.001)

  // Store normalization parameters and technical indicators with the model
  const model = {
    network,
    normalizationParams: { min, max },
    sequenceLength,
    trainingError: network.trainingError,
    iterations: network.iterations,
  }

  return model
}

/**
 * Use trained model to predict future stock prices
 */
export function predictNextPrice(model: any, stockData: StockData[], daysToPredict = 5): PredictionResult {
  const prices = stockData.map((d) => d.price)
  const { min, max } = model.normalizationParams
  const { network, sequenceLength } = model

  // Normalize current prices
  const { normalized: normalizedPrices } = normalizeData(prices)

  // Calculate technical indicators for the entire dataset
  const technicalIndicators = calculateTechnicalIndicators(stockData)

  // Get the last sequence for prediction
  if (normalizedPrices.length < sequenceLength) {
    throw new Error(`Need at least ${sequenceLength} data points for prediction`)
  }

  const futurePrices: number[] = []
  const futureDates: string[] = []

  // Use the last known data for initial prediction
  const currentPrices = [...normalizedPrices]
  const currentStockData = [...stockData]

  const lastDate = new Date(stockData[stockData.length - 1].date)

  for (let i = 0; i < daysToPredict; i++) {
    // Prepare input for prediction
    const priceSequence = currentPrices.slice(-sequenceLength)
    const lastIndicators = technicalIndicators[technicalIndicators.length - 1]
    const normalizedIndicators = lastIndicators.map((ind) => Math.max(0, Math.min(1, (ind + 1) / 2)))

    const input = [...priceSequence, ...normalizedIndicators]

    // Make prediction
    const prediction = network.predict(input)
    const predictedNormalizedPrice = prediction[0]

    // Denormalize the prediction
    const predictedPrice = denormalizeValue(predictedNormalizedPrice, min, max)
    const clampedPrice = Math.max(0.01, predictedPrice) // Ensure positive price

    futurePrices.push(clampedPrice)

    // Generate future date
    const futureDate = new Date(lastDate)
    futureDate.setDate(lastDate.getDate() + i + 1)
    futureDates.push(futureDate.toISOString().split("T")[0])

    // Update current prices for next prediction
    currentPrices.push(predictedNormalizedPrice)

    // Add predicted data point for technical indicator calculation
    currentStockData.push({
      date: futureDate.toISOString().split("T")[0],
      price: clampedPrice,
      volume: 0,
    })
  }

  const currentPrice = prices[prices.length - 1]
  const predictedPrice = futurePrices[0] // Next day prediction

  // Calculate confidence based on training error and price volatility
  const recentPrices = prices.slice(-10)
  const volatility = calculateVolatility(recentPrices)
  const normalizedVolatility = volatility / currentPrice
  const confidence = Math.max(0.3, Math.min(0.95, 1 - (model.trainingError * 10 + normalizedVolatility)))

  return {
    currentPrice,
    predictedPrice,
    futurePrices,
    futureDates,
    confidence,
    trainingError: model.trainingError,
    iterations: model.iterations,
  }
}

/**
 * Calculate price volatility (standard deviation)
 */
function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0

  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2))
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / prices.length

  return Math.sqrt(variance)
}
