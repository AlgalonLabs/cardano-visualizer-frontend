"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Epoch = {
  no: number;
  start_time: string;
  end_time: string;
  blk_count: number;
  tx_count: number;
  out_sum: number;
  fees: number;
};

export const columns: ColumnDef<Epoch>[] = [
  {
    accessorKey: "no",
    header: "Epoch Number",
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
  },
  {
    accessorKey: "fees",
    header: "Fees",
  },
];