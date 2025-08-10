import { ethers, Contract, Provider, Signer } from 'ethers';
import { INDIETREAT_ABI } from './contract/abi';
import {
    OptiMonaConfig,
    Purchase,
    PurchaseOptions,
    PurchaseEvent,
    EventListenerOptions,
    EventListener
} from './types';

export class OptiMona {
    private contract: Contract;
    private provider: Provider;
    private signer?: Signer;

    constructor(config: OptiMonaConfig) {
        if (!config.contractAddress) {
            throw new Error('Contract address is required');
        }

        // Initialize provider
        if (config.provider) {
            this.provider = config.provider;
        } else if (config.rpcUrl) {
            this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
        } else {
            throw new Error('Either provider or rpcUrl must be provided');
        }

        // Initialize signer if provided
        this.signer = config.signer;

        // Initialize contract
        this.contract = new Contract(
            config.contractAddress,
            INDIETREAT_ABI,
            this.signer || this.provider
        );
    }

    /**
     * Get the total number of purchases for a specific store
     * @param storeId The store ID
     * @returns The total number of purchases for the store
     */
    async getStorePurchaseCount(storeId: bigint | number): Promise<bigint> {
        try {
            const count = await this.contract.getStorePurchaseCount(storeId);
            return count;
        } catch (error) {
            throw new Error(`Failed to get store purchase count: ${error}`);
        }
    }

    /**
     * Get purchase information for a specific store and purchase ID
     * @param storeId The store ID
     * @param purchaseId The purchase ID within that store
     * @returns Purchase information
     */
    async getPurchase(storeId: bigint | number, purchaseId: bigint | number): Promise<Purchase> {
        try {
            const result = await this.contract.getPurchase(storeId, purchaseId);

            return {
                productName: result[0],
                username: result[1],
                userId: result[2],
                timestamp: result[3],
                amount: result[4],
                wallet: result[5],
            };
        } catch (error) {
            throw new Error(`Failed to get purchase: ${error}`);
        }
    }

    /**
     * Get multiple purchases for a store by range
     * @param storeId The store ID
     * @param startId Starting purchase ID (inclusive)
     * @param endId Ending purchase ID (exclusive)
     * @returns Array of purchases
     */
    async getPurchasesByRange(
        storeId: bigint | number,
        startId: bigint | number,
        endId: bigint | number
    ): Promise<Purchase[]> {
        try {
            const purchases: Purchase[] = [];

            for (let i = startId; i < endId; i++) {
                try {
                    const purchase = await this.getPurchase(storeId, i);
                    purchases.push(purchase);
                } catch (error) {
                    // If purchase doesn't exist, break the loop
                    if (error instanceof Error && error.message.includes('Purchase does not exist')) {
                        break;
                    }
                    throw error;
                }
            }

            return purchases;
        } catch (error) {
            throw new Error(`Failed to get purchases by range: ${error}`);
        }
    }

    /**
     * Get all purchases for a store
     * @param storeId The store ID
     * @returns Array of all purchases for the store
     */
    async getAllPurchases(storeId: bigint | number): Promise<Purchase[]> {
        try {
            const count = await this.getStorePurchaseCount(storeId);
            return await this.getPurchasesByRange(storeId, 0, count);
        } catch (error) {
            throw new Error(`Failed to get all purchases: ${error}`);
        }
    }

    /**
     * Check if a store exists (has at least one purchase)
     * @param storeId The store ID
     * @returns True if the store has at least one purchase, false otherwise
     */
    async storeExists(storeId: bigint | number): Promise<boolean> {
        try {
            return await this.contract.storeExists(storeId);
        } catch (error) {
            throw new Error(`Failed to check if store exists: ${error}`);
        }
    }

    /**
     * Make a purchase (requires signer)
     * @param storeId The store ID
     * @param options Purchase options
     * @returns Transaction receipt
     */
    async purchase(storeId: bigint | number, options: PurchaseOptions) {
        if (!this.signer) {
            throw new Error('Signer is required to make purchases');
        }

        try {
            const value = typeof options.value === 'string'
                ? ethers.parseEther(options.value)
                : options.value;

            const userId = typeof options.userId === 'number'
                ? BigInt(options.userId)
                : options.userId;

            const tx = await this.contract.purchase(
                storeId,
                options.productName,
                options.username,
                userId,
                options.wallet,
                { value }
            );

            return await tx.wait();
        } catch (error) {
            throw new Error(`Failed to make purchase: ${error}`);
        }
    }

    /**
     * Listen to purchase events for a specific store
     * @param storeId The store ID to listen to
     * @param callback Callback function for purchase events
     * @param options Optional configuration for the event listener
     * @returns Event listener with cleanup function
     */
    onPurchase(
        storeId: bigint | number,
        callback: (event: PurchaseEvent) => void,
        options: EventListenerOptions = {}
    ): EventListener {
        const {
            pollInterval = 2000,
            maxRetries = 5,
            retryDelay = 1000
        } = options;

        let isListening = true;
        let lastProcessedBlock = 0n;
        const processedEvents = new Set<string>(); // Track processed events to prevent duplicates

        const startPolling = async () => {
            while (isListening) {
                try {
                    // Get current block number
                    const currentBlock = BigInt(await this.provider.getBlockNumber());

                    // Start from the current block if this is the first run
                    const fromBlock = lastProcessedBlock > 0n ? lastProcessedBlock + 1n : currentBlock;
                    const toBlock = currentBlock;

                    // Only query if we have a valid block range
                    if (fromBlock <= toBlock) {
                        // Get logs for PurchaseMade events for this store
                        const logs = await this.provider.getLogs({
                            address: this.contract.target,
                            topics: [
                                this.contract.interface.getEvent('PurchaseMade')?.topicHash,
                                ethers.zeroPadValue(ethers.toBeHex(storeId), 32)
                            ].filter(Boolean) as string[],
                            fromBlock: fromBlock,
                            toBlock: toBlock
                        });

                        // Process any new events
                        for (const log of logs) {
                            try {
                                const parsedLog = this.contract.interface.parseLog(log);
                                if (parsedLog && parsedLog.args) {
                                    // Create unique event identifier for deduplication
                                    const eventId = `${parsedLog.args[0]}-${parsedLog.args[1]}-${parsedLog.args[5]}`;

                                    // Skip if already processed
                                    if (processedEvents.has(eventId)) {
                                        continue;
                                    }

                                    processedEvents.add(eventId);

                                    const event: PurchaseEvent = {
                                        storeId: parsedLog.args[0],
                                        purchaseId: parsedLog.args[1],
                                        productName: parsedLog.args[2],
                                        username: parsedLog.args[3],
                                        userId: parsedLog.args[4],
                                        timestamp: parsedLog.args[5],
                                        amount: parsedLog.args[6],
                                        wallet: parsedLog.args[7]
                                    };
                                    callback(event);
                                }
                            } catch (parseError) {
                                console.warn('Failed to parse log:', parseError);
                            }
                        }

                        // Update last processed block
                        lastProcessedBlock = currentBlock;
                    }
                } catch (error: any) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }

                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
        };

        // Start polling
        console.log('Using polling-based event listener for real-time events');
        startPolling().catch(error => {
            console.error('Event listener error:', error);
        });

        // Return cleanup function
        return {
            stop: () => {
                isListening = false;
                // Clear processed events to free memory
                processedEvents.clear();
            }
        };
    }

    /**
     * Get the contract instance
     * @returns The contract instance
     */
    getContract(): Contract {
        return this.contract;
    }

    /**
     * Get the provider instance
     * @returns The provider instance
     */
    getProvider(): Provider {
        return this.provider;
    }

    /**
     * Get the signer instance
     * @returns The signer instance or undefined
     */
    getSigner(): Signer | undefined {
        return this.signer;
    }
} 