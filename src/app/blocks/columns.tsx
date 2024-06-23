"use client";

import {ColumnDef} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";

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
    {
        id: "actions",
        cell: ({row}) => {
            const block = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(block.hash)}
                        >
                            Copy block hash
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>View block</DropdownMenuItem>
                        <DropdownMenuItem>View in Visualizer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];