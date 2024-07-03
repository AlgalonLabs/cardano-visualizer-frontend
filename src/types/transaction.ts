export interface Transaction {
    tx_hash: string;
    block_hash: string;
    block_no: number;
    epoch_no: number;
    slot_no: number;
    absolute_slot: number;
    fees: string;
    output_ada: string;
    input_addresses: string[];
    output_addresses: string[];
}

export interface InputUTXOInfo {
    address: string;
    stake_address: string;
    amount: number;
    utxo_index: number;
    utxo_hash?: string;
}

export interface OutputUTXOInfo {
    address: string;
    amount: number;
    utxo_hash?: string;
}

interface SummaryItem {
    address: string;
    net_amount: number;
    tokens_sent: number;
    tokens_received: number;
}

//  Used for the transaction details page
export interface TransactionDetails {
    hash: string;
    status: 'SUCCESS' | 'FAILED';
    created_at: string;
    total_output: number;
    fees: number;
    block_no: number;
    slot_no: number;
    absolute_slot_no: number;
    epoch_no: number;
    summary: SummaryItem[];
    inputs: InputUTXOInfo[];
    outputs: OutputUTXOInfo[];
}