import { OptiMona } from '../src';

async function example() {
    // Initialize the SDK with contract address and RPC URL
    const optimona = new OptiMona({
        // this is our sepolia contract address
        contractAddress: '0xa83E7fDF932b38B158963ec9b0492D3a5AEa9cfE',
        rpcUrl: 'https://optimism-rpc.publicnode.com'
    });

    const storeId = 1; // Replace with actual store ID

    try {
        // Check if store exists
        const exists = await optimona.storeExists(storeId);
        console.log(`Store ${storeId} exists:`, exists);

        if (exists) {
            // Get the total number of purchases for the store
            const purchaseCount = await optimona.getStorePurchaseCount(storeId);
            console.log(`Total purchases for store ${storeId}:`, purchaseCount.toString());

            // Get all purchases for the store
            const allPurchases = await optimona.getAllPurchases(storeId);
            console.log(`All purchases for store ${storeId}:`, allPurchases);

            // Get purchases by range (e.g., purchases 0-5)
            const purchasesByRange = await optimona.getPurchasesByRange(storeId, 0, 5);
            console.log(`Purchases 0-5 for store ${storeId}:`, purchasesByRange);

            // Get a specific purchase
            if (purchaseCount > 0n) {
                const firstPurchase = await optimona.getPurchase(storeId, 0);
                console.log(`First purchase for store ${storeId}:`, firstPurchase);
                console.log(`Wallet address: ${firstPurchase.wallet}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the example
example(); 