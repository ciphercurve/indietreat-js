import { OptiMona } from '../src';

async function robustEventListenerExample() {
    // Initialize the SDK with contract address and RPC URL
    const optimona = new OptiMona({
        contractAddress: '0xa83E7fDF932b38B158963ec9b0492D3a5AEa9cfE',
        rpcUrl: 'https://optimism-rpc.publicnode.com'
    });

    const storeId = 1; // Replace with actual store ID

    console.log('🚀 Starting event listener...');
    console.log(`📡 Listening to purchase events for store ${storeId}`);

    let eventCount = 0;
    const startTime = Date.now();

    // Listen to purchase events
    const eventListener = optimona.onPurchase(storeId, (event) => {
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
    });

    console.log('\n✅ Event listener started successfully!');
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
}

// Run the example
robustEventListenerExample().catch(error => {
    console.error('❌ Error in event listener example:', error);
    process.exit(1);
}); 
