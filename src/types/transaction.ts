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