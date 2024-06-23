'use client'

import React, {useEffect, useState} from 'react';
import {Block, columns} from './columns';
import {DataTable} from "@/app/epochs/data-table";
import {PaginationState} from '@tanstack/react-table';

const BlocksPage: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [totalCount, setTotalCount] = useState(0);

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns}
                data={blocks}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                totalCount={totalCount}
                onPageChange={setPagination}
            />
        </div>
    );
};

export default BlocksPage;