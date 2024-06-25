'use client'

import React, {useEffect, useState} from 'react';
import {Block, columns} from './columns';
import {DataTable} from "@/app/epochs/data-table";
import {ColumnDef, PaginationState} from '@tanstack/react-table';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {CellType} from "@/types/data-table";

const BlocksPage: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [totalCount, setTotalCount] = useState(0);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    useEffect(() => {
        async function fetchBlocks() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8002/blocks?skip=${pagination.pageIndex * pagination.pageSize}&limit=${pagination.pageSize}`
                );
                const data = await response.json();
                setBlocks(data.blocks);
                setTotalCount(data.total_count);
            } catch (error) {
                console.error('Failed to fetch blocks', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBlocks();
    }, [pagination]);

    const handleRowClick = (block: Block) => {
        setSelectedBlock(block);
        setIsSliderOpen(true);
    };

    const renderCellContent = (value: unknown): React.ReactNode => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        if (value === null || value === undefined) {
            return '';
        }
        if (React.isValidElement(value)) {
            return value;
        }
        // For other types, you might want to add more specific rendering logic
        return JSON.stringify(value);
    };

    const enhancedColumns: ColumnDef<Block>[] = columns.map(column => ({
        ...column,
        cell: (props) => {
            const cellContent = (column.cell as CellType<Block>);
            return (
                <div onClick={() => handleRowClick(props.row.original)} className="cursor-pointer">
                    {typeof cellContent === 'function'
                        ? cellContent(props)
                        : renderCellContent(props.getValue())
                    }
                </div>
            );
        }
    }));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={enhancedColumns}
                data={blocks}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                totalCount={totalCount}
                onPageChange={setPagination}
            />
            <Sheet open={isSliderOpen} onOpenChange={setIsSliderOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Block Details</SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                        {selectedBlock && (
                            <div className="space-y-4">
                                <p><strong>Block Hash:</strong> {selectedBlock.hash}</p>
                                <p><strong>Block Number:</strong> {selectedBlock.block_no}</p>
                                <p><strong>Epoch Number:</strong> {selectedBlock.epoch_no}</p>
                                <p><strong>Slot Number:</strong> {selectedBlock.slot_no}</p>
                                <p><strong>Size:</strong> {selectedBlock.size} bytes</p>
                                <p><strong>Transaction Count:</strong> {selectedBlock.tx_count}</p>
                                <p><strong>Timestamp:</strong> {new Date(selectedBlock.time).toLocaleString()}</p>
                            </div>
                        )}
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default BlocksPage;