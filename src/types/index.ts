export interface Purchase {
    productName: string;
    username: string;
    userId: bigint;
    timestamp: bigint;
    amount: bigint;
    wallet?: string; // Optional since not available in getPurchase function
}

export interface PurchaseEvent {
    storeId: bigint;
    purchaseId: bigint;
    productName: string;
    username: string;
    userId: bigint;
    timestamp: bigint;
    amount: bigint;
    wallet: string;
}

export interface IndieTreatConfig {
    contractAddress: string;
    rpcUrl?: string;
    provider?: any; // ethers Provider
    signer?: any; // ethers Signer
}

export interface PurchaseOptions {
    productName: string;
    username: string;
    userId: bigint | number;
    wallet: string;
    value: bigint | string; // ETH amount to send
}

export interface EventListenerOptions {
    pollInterval?: number; // Polling interval in milliseconds (default: 1000)
    maxRetries?: number;   // Maximum retry attempts for filter recreation (default: 5)
    retryDelay?: number;   // Delay between retries in milliseconds (default: 1000)
}

export interface EventListener {
    stop: () => void;
} 