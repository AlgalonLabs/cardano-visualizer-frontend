'use client'

import React, {useEffect, useState} from 'react';
import {columns} from './columns';
import {DataTable} from "@/app/blocks/data-table";
import {ColumnDef, PaginationState} from '@tanstack/react-table';
import {CellType} from "@/types/data-table";
import SheetWrapper from "@/components/ui/sheet-wrapper";
import BlockDetails from "@/components/details/block-details";
import {Block} from "@/types/block";

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
                <SheetWrapper
                    trigger={
                        <div onClick={() => handleRowClick(props.row.original)} className="cursor-pointer">
                            {typeof cellContent === 'function' ? cellContent(props) : props.getValue()}
                        </div>
                    }
                    title="Block Details"
                >
                    <BlockDetails block={props.row.original}/>
                </SheetWrapper>
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
                onPageChange={(newPagination) => setPagination(newPagination)}
            />
        </div>
    );
};
export default BlocksPage;