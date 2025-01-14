"use client";

import {ColumnDef} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import Link from "next/link";
import {Epoch} from "@/types/epoch";



export const columns: ColumnDef<Epoch>[] = [
    {
        accessorKey: "no",
        header: "Epoch Number",
        cell: ({row}) => (
            <Link href={`/epochs/${row.original.no}`}>{row.original.no}</Link>
        ),
    },
    {
        accessorKey: "start_time",
        header: "Start Time",
    },
    {
        accessorKey: "end_time",
        header: "End Time",
    },
    {
        accessorKey: "block_count",
        header: "Block Count",
    },
    {
        accessorKey: "tx_count",
        header: "Transaction Count",
    },
    {
        accessorKey: "out_sum",
        header: "Out Sum",
        cell: ({row}) => {
            return <div className="text-right">{row.getValue("out_sum")} ₳</div>;
        },
    },
    {
        accessorKey: "fees",
        header: "Fees",
        cell: ({row}) => {
            return <div className="text-right">{row.getValue("fees")} ₳</div>;
        },
    },
    {
        id: "actions",
        cell: ({row}) => {
            const epoch = row.original

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
                            onClick={() => navigator.clipboard.writeText(epoch.no.toString())}
                        >
                            Copy epoch no
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href={`/epochs/${epoch.no}`}>View epoch</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View in Visualizer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];