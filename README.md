# IndieTreat JavaScript SDK

[![npm version](https://badge.fury.io/js/indietreat-js.svg)](https://badge.fury.io/js/indietreat-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](https://ethereum.org/)

> A modern JavaScript SDK for interacting with the IndieTreat smart contract on Ethereum blockchain

## 📖 Overview

The **IndieTreat JavaScript SDK** provides a simple and intuitive interface to interact with the IndieTreat smart contract, which tracks purchases across different stores.
All you need to utilize this code is your `store id`. To get your `store id`, navigate to "manage account" and copy the #NUMBER after your username, for example `User#101`.
Currently the sdk points to our testnet contract on Sepolia `0xB99382f5df4f0e692F75d956820C515389ca5dCE`.

### ✨ Features

- 🔍 **Read Purchase Data** - Query purchase information from the smart contract
- 📡 **Real-time Events** - Listen to purchase events as they happen
- 💳 **Make Purchases** - Execute purchases with proper authentication
- 🛡️ **Type Safety** - Built with TypeScript for better developer experience
- ⚡ **Lightweight** - Minimal dependencies and optimized performance

## 🚀 Quick Start

### Installation

```bash
npm install indietreat-js
```

### Basic Usage

```typescript
import { IndieTreat } from 'indietreat-js';

// Initialize the SDK
const indietreat = new IndieTreat({
  contractAddress: '0x1234567890123456789012345678901234567890',
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'
});

// Get purchase count for a store
const count = await indietreat.getStorePurchaseCount(1);
console.log(`Store 1 has ${count} purchases`);

// Listen to purchase events with robust error handling
const eventListener = indietreat.onPurchase(1, (event) => {
  console.log('🎉 New purchase:', event);
}, {
  pollInterval: 2000,  // Poll every 2 seconds
  maxRetries: 10,      // Retry up to 10 times on filter errors
  retryDelay: 2000     // Wait 2 seconds between retries
});

// Stop listening when done
// eventListener.stop();
```


## Example output from EventListener
```
🎉 Purchase #1 detected (24912ms elapsed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Product: Example Product #1
👤 Username: jonas
🆔 User ID: 1752513806740
🏪 Store ID: 1
🛒 Purchase ID: 4
💰 Amount: 10000000000000 wei
👛 Wallet: 0x789226ed4EA2D248d2d4dd4A136459d44DD0fD41
⏰ Timestamp: 2025-07-14T17:23:36.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
Wallet here is the recipient wallet address. You must check that it matches the address for your product based on the `product name` and your `store id`.

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/indietreat-js.git
   cd indietreat-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the TypeScript source |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues automatically |

## 📚 Examples

Explore the examples to see the SDK in action:

### Basic Usage
```bash
npx ts-node examples/basic-usage.ts
```

### Robust Event Listener
```bash
npx ts-node examples/robust-event-listener.ts
```

## 🔧 Configuration

The SDK requires the following configuration:

```typescript
interface IndieTreatConfig {
  contractAddress: string;  // The deployed IndieTreat contract address
  rpcUrl: string;          // Ethereum RPC endpoint (Infura, Alchemy, etc.)
}
```

### Environment Variables

For development, you can use environment variables:

```bash
# .env
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
INDIE_TREAT_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## 📖 API Reference

### Core Methods

#### `getStorePurchaseCount(storeId: number): Promise<number>`
Returns the total number of purchases for a specific store.

#### `onPurchase(storeId: number, callback: (event: PurchaseEvent) => void, options?: EventListenerOptions): EventListener`
Sets up a robust listener for purchase events on a specific store with automatic error recovery and filter recreation.

**Options:**
- `pollInterval`: Polling interval in milliseconds (default: 1000)
- `maxRetries`: Maximum retry attempts for filter recreation (default: 5)
- `retryDelay`: Delay between retries in milliseconds (default: 1000)

**Returns:** An `EventListener` object with a `stop()` method to cleanly stop the listener.

#### `makePurchase(storeId: number, amount: string): Promise<TransactionReceipt>`
Executes a purchase transaction (requires wallet connection).

## 🔧 Error Handling & Troubleshooting

### Common Issues

#### Duplicate Events (Fixed in v1.1.0)
The SDK now includes robust deduplication to prevent the same purchase event from being processed multiple times. This fix addresses:
- Events being fired 6x instead of once
- Duplicate callbacks from multiple event listening mechanisms
- Memory leaks from unprocessed events

#### Filter Not Found Error
If you encounter a "filter not found" error, the improved `onPurchase` method will automatically handle this by:
- Detecting the error and recreating the filter
- Retrying the operation with configurable retry limits
- Logging warnings and errors for debugging

#### Network Connectivity Issues
The event listener includes built-in resilience for:
- Temporary network disconnections
- RPC endpoint timeouts
- Filter expiration

### Best Practices

1. **Configure Appropriate Polling Intervals**
   ```typescript
   // For real-time applications
   const realtimeConfig = { pollInterval: 500, maxRetries: 5 };
   
   // For stable, long-running applications
   const stableConfig = { pollInterval: 5000, maxRetries: 15 };
   ```

2. **Always Clean Up Event Listeners**
   ```typescript
   const listener = indietreat.onPurchase(storeId, callback);
   
   // Clean up when done
   listener.stop();
   ```

3. **Handle Process Termination**
   ```typescript
   process.on('SIGINT', () => {
     listener.stop();
     process.exit(0);
   });
   ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.