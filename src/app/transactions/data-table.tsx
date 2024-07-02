import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
    Updater,
    useReactTable,
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (pagination: Updater<PaginationState>) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             pageIndex,
                                             pageSize,
                                             totalCount,
                                             onPageChange,
                                         }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(totalCount / pageSize),
        state: {
            pagination: {pageIndex, pageSize},
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        onPaginationChange: (pagination) => onPageChange(pagination),
    });

    const pageSizeOptions = [10, 20, 30, 40, 50, 100, 200];

    return (
        <div>
            <div className="rounded-md border h-[700px] overflow-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <span>Show</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            const newPageSize = Number(value);
                            table.setPageSize(newPageSize);
                            onPageChange({pageIndex: 0, pageSize: newPageSize});
                        }}
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder={pageSize}/>
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>per page</span>
                </div>
                <div>
                    Showing {(pageIndex * pageSize + 1).toLocaleString()} to {Math.min((pageIndex + 1) * pageSize, totalCount).toLocaleString()} of {totalCount.toLocaleString()} results

                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={pageIndex === 0}>
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={(pageIndex + 1) * pageSize >= totalCount}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}