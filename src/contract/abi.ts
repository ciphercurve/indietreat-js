export const INDIETREAT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "storeId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "productName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "purchase",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "storeId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "purchaseId",
                "type": "uint256"
            }
        ],
        "name": "getPurchase",
        "outputs": [
            {
                "internalType": "string",
                "name": "productName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "storeId",
                "type": "uint256"
            }
        ],
        "name": "getStorePurchaseCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "storeId",
                "type": "uint256"
            }
        ],
        "name": "storeExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "stores",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "purchaseCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "storeId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "purchaseId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "productName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "PurchaseMade",
        "type": "event"
    }
] as const; 