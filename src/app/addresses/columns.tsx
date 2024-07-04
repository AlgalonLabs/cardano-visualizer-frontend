import {ColumnDef} from "@tanstack/react-table";
import {AddressRow} from "@/types/address";

export const columns: ColumnDef<AddressRow>[] = [
    {
        accessorKey: "address",
        header: "Address",
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