# Stock Market Prediction App using Brain.js

A comprehensive stock market prediction application built with React, Next.js, and Brain.js neural networks. This app demonstrates AI-powered financial forecasting with an intuitive user interface.

## 🚀 Features

- **Neural Network Prediction**: Uses Brain.js to train feedforward neural networks for stock price prediction
- **Interactive Data Visualization**: Real-time charts showing historical data and AI predictions using Chart.js
- **Flexible Data Input**: Support for JSON and CSV file uploads, plus sample dataset
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Real-time Training**: Watch the model train and see performance metrics
- **Extended Forecasting**: Predict multiple days into the future with confidence indicators

## 🛠️ Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **AI/ML**: Brain.js (Neural Networks)
- **Visualization**: Chart.js
- **UI Components**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React

## 📊 How It Works

### Neural Network Architecture
- **Input Layer**: 5 neurons (looks at 5 previous stock prices)
- **Hidden Layers**: Two layers with 10 and 8 neurons respectively
- **Output Layer**: 1 neuron (predicts next price)
- **Activation Function**: Sigmoid
- **Training Algorithm**: Backpropagation with configurable learning rate

### Data Processing
1. **Normalization**: Stock prices are normalized to 0-1 range for optimal training
2. **Sequence Creation**: Uses sliding window approach to create training sequences
3. **Prediction**: Trained model predicts future prices using recent price patterns
4. **Denormalization**: Predictions are converted back to actual price scale

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd stock-prediction-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Data Format

### JSON Format
\`\`\`json
[
  {"date": "2024-01-01", "price": 150.25},
  {"date": "2024-01-02", "price": 152.10},
  {"date": "2024-01-03", "price": 148.75}
]
\`\`\`

### CSV Format
\`\`\`csv
date,price
2024-01-01,150.25
2024-01-02,152.10
2024-01-03,148.75
\`\`\`

## 🧠 Model Logic

The application uses a feedforward neural network with the following approach:

1. **Data Preprocessing**: 
   - Normalizes price data to improve training stability
   - Creates sequences of 5 consecutive prices as input features

2. **Training Process**:
   - Uses supervised learning with historical price sequences
   - Trains for up to 2000 iterations or until error threshold is met
   - Implements early stopping to prevent overfitting

3. **Prediction Generation**:
   - Takes the last 5 prices as input
   - Generates predictions for specified number of future days
   - Uses sliding window approach for multi-day forecasting

4. **Confidence Calculation**:
   - Based on recent price volatility
   - Higher volatility = lower confidence
   - Provides realistic uncertainty estimates

## 📚 Third-Party Libraries

- **brain.js**: Neural network library for JavaScript
- **chart.js**: Flexible charting library for data visualization
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Beautiful & consistent icon toolkit

## 🚀 Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

**Live Demo**: [Your deployed app URL here]

## ⚠️ Disclaimer

This application is for educational purposes only. Stock market predictions are inherently uncertain, and this tool should not be used for actual financial decisions. Always consult with financial professionals before making investment choices.

## 📝 Assignment Requirements Met

- ✅ Brain.js neural network implementation
- ✅ Historical stock data (60+ data points)
- ✅ Interactive data visualization with Chart.js
- ✅ Responsive React UI with proper component structure
- ✅ File upload functionality for custom datasets
- ✅ Deployed application ready for production
- ✅ Comprehensive documentation

## 🤝 Contributing

This is an academic project. Please ensure all contributions maintain the educational focus and code clarity for learning purposes.
\`\`\`
