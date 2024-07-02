export interface Transaction {
    tx_hash: string;
    block_hash: string;
    epoch_no: number;
    slot_no: number;
    absolute_slot: number;
    fees: string;
    output_ada: string;
    input_addresses: string[];
    output_addresses: string[];
}

export interface UTXOInfo {
    address: string;
    amount: number;
    utxo_hash?: string;
}

export interface TransactionDetails {
    hash: string;
    status: 'SUCCESS' | 'FAILED';
    createdAt: string;
    totalOutput: number;
    fee: number;
    blockNumber: number;
    slot: number;
    absoluteSlot: number;
    epoch: number;
    confirmations: number;
    inputs: UTXOInfo[];
    outputs: UTXOInfo[];
}