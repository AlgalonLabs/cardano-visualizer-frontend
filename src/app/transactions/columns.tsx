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
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import Link from "next/link";
import {Transaction} from "@/types/transaction";

const renderAddresses = (addresses: string[]) => (
    <div className="space-y-1 max-h-20 overflow-y-auto">
        {addresses.map((address, index) => (
            <div key={index}>
                <Link href={`/addresses/${address}`} className="text-blue-500 hover:underline">
                    {address.substring(0, 8)}...{address.substring(address.length - 8)}
                </Link>
            </div>
        ))}
    </div>
);

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "tx_hash",
        header: "Tx Hash",
        cell: ({row}) => (
            <Link href={`/transactions/${row.getValue("tx_hash")}`} className="text-blue-500 hover:underline">
                {(row.getValue("tx_hash") as string).substring(0, 8)}...
            </Link>
        ),
    },
    {
        accessorKey: "block_no",
        header: "Block",
        cell: ({row}) => (
            <Link href={`/blocks/${row.getValue("block_no")}`} className="text-blue-500 hover:underline">
                {(row.getValue("block_no") as string).substring(0, 8)}...
            </Link>
        ),
    },
    {
        accessorKey: "epoch_no",
        header: "Epoch",
        cell: ({row}) => (
            <Link href={`/epochs/${row.getValue("epoch_no")}`} className="text-blue-500 hover:underline">
                {row.getValue("epoch_no")}
            </Link>
        ),
    },
    {
        accessorKey: "slot_no",
        header: "Slot",
    },
    {
        accessorKey: "absolute_slot",
        header: "Absolute Slot",
    },
    {
        accessorKey: "fees",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fees
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const fees = parseFloat(row.getValue("fees"));
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'ADA',
            }).format(fees);
            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "output_ada",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Output in ADA
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("output_ada"));
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'ADA',
            }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "input_addresses",
        header: "Input Addresses",
        cell: ({row}) => renderAddresses(row.getValue("input_addresses")),
    },
    {
        accessorKey: "output_addresses",
        header: "Output Addresses",
        cell: ({row}) => renderAddresses(row.getValue("output_addresses")),
    },
    {
        id: "actions",
        cell: ({row}) => {
            const transaction = row.original

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
                            onClick={() => navigator.clipboard.writeText(transaction.tx_hash)}
                        >
                            Copy transaction hash
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href={`/transactions/${transaction.tx_hash}`}>View transaction</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`/graph/transactions/${transaction.tx_hash}`}>View in Visualizer</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];