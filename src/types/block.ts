export interface Block {
    hash: string;
    block_id: number;
    block_no: number;
    epoch_no: number;
    slot_no: number;
    epoch_slot_no: number;
    proto_major: number;
    proto_minor: number;
    vrf_key: string;
    op_cert: string;
    op_cert_counter: number;
    size: number;
    tx_count: number;
    time: string;
};
