import { IndieTreat } from '../src';

async function robustEventListenerExample() {
    // Initialize the SDK with contract address and RPC URL
    const indietreat = new IndieTreat({
        contractAddress: '0xB99382f5df4f0e692F75d956820C515389ca5dCE',
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
    });

    const storeId = 1; // Replace with actual store ID

    console.log('🚀 Starting robust event listener example...');
    console.log(`📡 Listening to purchase events for store ${storeId}`);

    // Configuration for different scenarios
    const configurations = {
        // Fast polling for real-time applications
        realtime: {
            pollInterval: 500,   // Poll every 500ms
            maxRetries: 5,       // Retry 5 times
            retryDelay: 1000     // Wait 1 second between retries
        },
        // Balanced configuration for most use cases
        balanced: {
            pollInterval: 2000,  // Poll every 2 seconds
            maxRetries: 10,      // Retry 10 times
            retryDelay: 2000     // Wait 2 seconds between retries
        },
        // Conservative configuration for stable connections
        conservative: {
            pollInterval: 5000,  // Poll every 5 seconds
            maxRetries: 15,      // Retry 15 times
            retryDelay: 5000     // Wait 5 seconds between retries
        }
    };

    // Use balanced configuration
    const config = configurations.balanced;
    console.log('⚙️  Using balanced configuration:', config);

    let eventCount = 0;
    const startTime = Date.now();

    // Listen to purchase events with robust error handling
    const eventListener = indietreat.onPurchase(storeId, (event) => {
        eventCount++;
        const elapsed = Date.now() - startTime;

        console.log(`\n🎉 Purchase #${eventCount} detected (${elapsed}ms elapsed)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 Product:', event.productName);
        console.log('👤 Username:', event.username);
        console.log('🆔 User ID:', event.userId.toString());
        console.log('🏪 Store ID:', event.storeId.toString());
        console.log('🛒 Purchase ID:', event.purchaseId.toString());
        console.log('💰 Amount:', event.amount.toString(), 'wei');
        console.log('👛 Wallet:', event.wallet);
        console.log('⏰ Timestamp:', new Date(Number(event.timestamp) * 1000).toISOString());
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, config);

    console.log('\n✅ Event listener started successfully!');
    console.log('📊 Configuration:', config);
    console.log('🔄 The listener will automatically handle filter errors and recreate filters as needed');
    console.log('⏹️  Press Ctrl+C to stop the listener\n');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, stopping event listener...');
        eventListener.stop();
        console.log(`📈 Total events received: ${eventCount}`);
        console.log(`⏱️  Total runtime: ${Date.now() - startTime}ms`);
        console.log('✅ Event listener stopped gracefully');
        process.exit(0);
    });

    // Handle process termination
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, stopping event listener...');
        eventListener.stop();
        console.log(`📈 Total events received: ${eventCount}`);
        console.log(`⏱️  Total runtime: ${Date.now() - startTime}ms`);
        console.log('✅ Event listener stopped gracefully');
        process.exit(0);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('\n❌ Uncaught exception:', error);
        eventListener.stop();
        process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('\n❌ Unhandled promise rejection:', reason);
        eventListener.stop();
        process.exit(1);
    });
}

// Run the example
robustEventListenerExample().catch(error => {
    console.error('❌ Error in robust event listener example:', error);
    process.exit(1);
}); 