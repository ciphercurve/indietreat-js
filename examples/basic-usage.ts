import { IndieTreat } from '../src';

async function example() {
    // Initialize the SDK with contract address and RPC URL
    const indietreat = new IndieTreat({
        // this is our sepolia contract address
        contractAddress: '0xB99382f5df4f0e692F75d956820C515389ca5dCE',
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
    });

    const storeId = 1; // Replace with actual store ID

    try {
        // Check if store exists
        const exists = await indietreat.storeExists(storeId);
        console.log(`Store ${storeId} exists:`, exists);

        if (exists) {
            // Get the total number of purchases for the store
            const purchaseCount = await indietreat.getStorePurchaseCount(storeId);
            console.log(`Total purchases for store ${storeId}:`, purchaseCount.toString());

            // Get all purchases for the store
            const allPurchases = await indietreat.getAllPurchases(storeId);
            console.log(`All purchases for store ${storeId}:`, allPurchases);

            // Get purchases by range (e.g., purchases 0-5)
            const purchasesByRange = await indietreat.getPurchasesByRange(storeId, 0, 5);
            console.log(`Purchases 0-5 for store ${storeId}:`, purchasesByRange);

            // Get a specific purchase
            if (purchaseCount > 0n) {
                const firstPurchase = await indietreat.getPurchase(storeId, 0);
                console.log(`First purchase for store ${storeId}:`, firstPurchase);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the example
example(); 