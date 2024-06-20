export interface AddressDetails {
    address: string;
    balance: number;
    transactions: TransactionSummary[];
}

export interface TransactionDetails {
    txHash: string;
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
    timestamp: string;
}

export interface BlockDetails {
    blockHash: string;
    epoch: number;
    transactions: TransactionSummary[];
    timestamp: string;
}

export interface AssetDetails {
    assetId: string;
    policy: string;
    name: string;
    quantity: number;
    transactions: TransactionSummary[];
}

export interface EpochDetails {
    epochNo: number;
    startTime: string;
    endTime: string;
    blockCount: number;
    totalSpent: number;
}

export interface TransactionSummary {
    txHash: string;
    value: number;
    timestamp: string;
}

export interface TransactionInput {
    address: string;
    value: number;
}

export interface TransactionOutput {
    address: string;
    value: number;
}