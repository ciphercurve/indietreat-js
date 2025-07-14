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

import { IndieTreat } from '../IndieTreat';

describe('IndieTreat SDK', () => {
    let indietreat: IndieTreat;

    beforeEach(() => {
        indietreat = new IndieTreat({
            contractAddress: '0x1234567890123456789012345678901234567890',
            rpcUrl: 'https://example.com'
        });
    });

    describe('constructor validation', () => {
        it('should throw error if contract address is missing', () => {
            expect(() => {
                new IndieTreat({} as any);
            }).toThrow('Contract address is required');
        });

        it('should throw error if neither provider nor rpcUrl is provided', () => {
            expect(() => {
                new IndieTreat({ contractAddress: '0x123' } as any);
            }).toThrow('Either provider or rpcUrl must be provided');
        });

        it('should initialize with valid config', () => {
            expect(indietreat).toBeInstanceOf(IndieTreat);
        });
    });

    describe('SDK instance', () => {
        it('should have required methods', () => {
            expect(typeof indietreat.getStorePurchaseCount).toBe('function');
            expect(typeof indietreat.getPurchase).toBe('function');
            expect(typeof indietreat.getAllPurchases).toBe('function');
            expect(typeof indietreat.storeExists).toBe('function');
            expect(typeof indietreat.purchase).toBe('function');
            expect(typeof indietreat.onPurchase).toBe('function');
        });

        it('should return contract, provider, and signer instances', () => {
            expect(indietreat.getContract()).toBeDefined();
            expect(indietreat.getProvider()).toBeDefined();
            expect(indietreat.getSigner()).toBeUndefined();
        });
    });

    describe('onPurchase method', () => {
        it('should return an EventListener with stop method', () => {
            const mockCallback = jest.fn();
            const eventListener = indietreat.onPurchase(1, mockCallback);

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

            const eventListener = indietreat.onPurchase(1, mockCallback, options);

            expect(eventListener).toBeDefined();
            expect(typeof eventListener.stop).toBe('function');
        });
    });
}); 