// Mock ethers
const mockContract = {
    getStorePurchaseCount: jest.fn().mockResolvedValue(5n),
    getPurchase: jest.fn().mockResolvedValue(['Product', 'User', 1n, 1234567890n, 1000000000000000000n]),
    storeExists: jest.fn().mockResolvedValue(true),
    purchase: jest.fn().mockResolvedValue({ wait: jest.fn().mockResolvedValue({}) }),
    filters: {
        PurchaseMade: jest.fn().mockReturnValue({ topics: ['0x123'] })
    },
    on: jest.fn(),
    off: jest.fn(),
    target: '0x1234567890123456789012345678901234567890',
    interface: {
        parseLog: jest.fn().mockReturnValue({
            args: [1n, 1n, 'Product', 'User', 1n, 1234567890n, 1000000000000000000n, '0x123']
        })
    }
};

const mockProvider = {
    getLogs: jest.fn().mockResolvedValue([])
};

const ethersMock = {
    Contract: jest.fn().mockImplementation(() => mockContract),
    JsonRpcProvider: jest.fn().mockImplementation(() => mockProvider),
    parseEther: jest.fn().mockImplementation((value) => BigInt(value) * BigInt(10 ** 18)),
};

type EthersMockType = typeof ethersMock & { ethers: any };
(ethersMock as EthersMockType).ethers = ethersMock;

jest.mock('ethers', () => ethersMock);

import { OptiMona } from '../OptiMona';

describe('OptiMona SDK', () => {
    let optimona: OptiMona;

    beforeEach(() => {
        optimona = new OptiMona({
            contractAddress: '0x1234567890123456789012345678901234567890',
            rpcUrl: 'https://example.com'
        });
    });

    describe('constructor validation', () => {
        it('should throw error if contract address is missing', () => {
            expect(() => {
                new OptiMona({} as any);
            }).toThrow('Contract address is required');
        });

        it('should throw error if neither provider nor rpcUrl is provided', () => {
            expect(() => {
                new OptiMona({ contractAddress: '0x123' } as any);
            }).toThrow('Either provider or rpcUrl must be provided');
        });

        it('should initialize with valid config', () => {
            expect(optimona).toBeInstanceOf(OptiMona);
        });
    });

    describe('SDK instance', () => {
        it('should have required methods', () => {
            expect(typeof optimona.getStorePurchaseCount).toBe('function');
            expect(typeof optimona.getPurchase).toBe('function');
            expect(typeof optimona.getAllPurchases).toBe('function');
            expect(typeof optimona.storeExists).toBe('function');
            expect(typeof optimona.purchase).toBe('function');
            expect(typeof optimona.onPurchase).toBe('function');
        });

        it('should return contract, provider, and signer instances', () => {
            expect(optimona.getContract()).toBeDefined();
            expect(optimona.getProvider()).toBeDefined();
            expect(optimona.getSigner()).toBeUndefined();
        });
    });

    describe('onPurchase method', () => {
        it('should return an EventListener with stop method', () => {
            const mockCallback = jest.fn();
            const eventListener = optimona.onPurchase(1, mockCallback);

            expect(eventListener).toBeDefined();
            expect(typeof eventListener.stop).toBe('function');
        });

        it('should accept optional configuration options', () => {
            const mockCallback = jest.fn();
            const options = {
                pollInterval: 2000,
                maxRetries: 10,
                retryDelay: 2000
            };

            const eventListener = optimona.onPurchase(1, mockCallback, options);

            expect(eventListener).toBeDefined();
            expect(typeof eventListener.stop).toBe('function');
        });
    });
}); 