import {ColumnDef} from "@tanstack/react-table";
import {AddressRow} from "@/types/address";
import Link from "next/link";

export const columns: ColumnDef<AddressRow>[] = [
    {
        accessorKey: "address",
        header: "Address",
        cell: ({row}) => (
            <Link href={`/addresses/${row.getValue("address")}`} className="text-blue-500 hover:underline">
                {(row.getValue("address") as string).substring(0, 8)}...
            </Link>
        )
    },
    {
        accessorKey: "balance",
        header: "Total Balance",
        cell: ({row}) => {
            const balance = parseFloat(row.getValue("balance"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "ADA",
            }).format(balance / 1000000); // Assuming balance is in lovelace
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "transactionCount",
        header: "Transaction Count",
        cell: ({row}) => {
            return <div className="text-center">{row.getValue("transactionCount")}</div>;
        },
    },
];