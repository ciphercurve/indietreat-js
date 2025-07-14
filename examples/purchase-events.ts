import { IndieTreat } from '../src';

async function listenToPurchases() {
    // Initialize the SDK with contract address and RPC URL
    const indietreat = new IndieTreat({
        // this is our sepolia contract address
        contractAddress: '0xB99382f5df4f0e692F75d956820C515389ca5dCE',
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
    });

    const storeId = 1; // Replace with actual store ID

    console.log(`Listening to purchase events for store ${storeId}...`);

    // Listen to purchase events for the specific store with improved error handling
    const eventListener = indietreat.onPurchase(storeId, (event) => {
        console.log('🎉 New purchase detected!');
        console.log('Store ID:', event.storeId.toString());
        console.log('Purchase ID:', event.purchaseId.toString());
        console.log('Product:', event.productName);
        console.log('Username:', event.username);
        console.log('User ID:', event.userId.toString());
        console.log('Timestamp:', new Date(Number(event.timestamp) * 1000).toISOString());
        console.log('Amount:', event.amount.toString(), 'wei');
        console.log('Wallet:', event.wallet);
        console.log('---');
    }, {
        pollInterval: 2000,  // Poll every 2 seconds
        maxRetries: 10,      // Retry up to 10 times on filter errors
        retryDelay: 2000     // Wait 2 seconds between retries
    });

    console.log('Listening for purchase events... Press Ctrl+C to stop.');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping event listener...');
        eventListener.stop();
        console.log('Event listener stopped.');
        process.exit(0);
    });

    // Handle process termination
    process.on('SIGTERM', () => {
        console.log('\n🛑 Stopping event listener...');
        eventListener.stop();
        console.log('Event listener stopped.');
        process.exit(0);
    });
}

// Run the example
listenToPurchases().catch(error => {
    console.error('Error in purchase event listener:', error);
    process.exit(1);
}); 