'use client'

import React, {useEffect, useState} from 'react';
import {Block, columns} from './columns';
import {DataTable} from "@/app/epochs/data-table";
import {ColumnDef, PaginationState} from '@tanstack/react-table';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {CellType} from "@/types/data-table";
import {Button} from "@/components/ui/button";

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
    };

    const enhancedColumns: ColumnDef<Block>[] = columns.map(column => ({
        ...column,
        cell: (props) => {
            const cellContent = (column.cell as CellType<Block>);
            return (
                <Sheet>
                    <SheetTrigger asChild>
                        <div onClick={() => handleRowClick(props.row.original)} className="cursor-pointer">
                            {typeof cellContent === 'function'
                                ? cellContent(props)
                                : props.getValue()
                            }
                        </div>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="text-center">Block Details</SheetTitle>
                        </SheetHeader>
                        <BlockDetails block={props.row.original}/>
                    </SheetContent>
                </Sheet>
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
        </div>
    );
};

const BlockDetails: React.FC<{ block: Block }> = ({block}) => (
    <div className="space-y-6 py-4">
        <div className="text-center">
            <div className="inline-block rounded-full border-4 border-blue-500 p-8">
                <div className="text-4xl font-bold">{block.epoch_no}</div>
                <div className="text-sm uppercase">Epoch</div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-xl font-bold">{block.block_no}</div>
                <div className="text-sm uppercase">Block</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-xl font-bold">{block.slot_no}/56332</div>
                <div className="text-sm uppercase">Slot</div>
            </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between">
                <span>Block Id</span>
                <span
                    className="font-mono text-blue-600">{block.hash.substring(0, 10)}...{block.hash.substring(block.hash.length - 10)}</span>
            </div>
            <div className="flex justify-between">
                <span>Absolute Slot</span>
                <span>{block.slot_no}</span>
            </div>
            <div className="flex justify-between">
                <span>Created At</span>
                <span>{new Date(block.time).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span>Transaction Fees</span>
                <span>{block.tx_count} ₳</span>
            </div>
            <div className="flex justify-between">
                <span>Total Output in ADA</span>
                <span>{block.size} ₳</span>
            </div>
        </div>

        <div className="pt-4">
            <Button className="w-full">View details</Button>
        </div>
    </div>
);

export default BlocksPage;