"use client";

import {ColumnDef} from "@tanstack/react-table";

export type Block = {
    hash: string;
    block_no: number;
    epoch_no: number;
    slot_no: number;
    size: number;
    tx_count: number;
    time: string;
};

export const columns: ColumnDef<Block>[] = [
    {
        accessorKey: "block_no",
        header: "Block Number",
    },
    {
        accessorKey: "epoch_no",
        header: "Epoch Number",
    },
    {
        accessorKey: "slot_no",
        header: "Slot Number",
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({row}) => {
            return <div className="text-right">{row.getValue("size")} bytes</div>;
        },
    },
    {
        accessorKey: "tx_count",
        header: "Transaction Count",
    },
    {
        accessorKey: "time",
        header: "Timestamp",
    },
];