'use client'

import React, {useEffect, useState} from 'react';
import {ColumnDef, PaginationState} from "@tanstack/react-table";
import {fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {Transaction} from '@/types/transaction';
import {columns} from './columns';
import {DataTable} from "@/app/transactions/data-table";

export default function TransactionsPage() {
    const [data, setData] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    const {toast} = useToast();

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await fetchApi(`/transactions?page=${pageIndex + 1}&page_size=${pageSize}`);
                setData(response.transactions);
                setTotalCount(response.total_count);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                toast({
                    title: "Error",
                    description: "Failed to load transactions. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [pageIndex, pageSize, toast]);

    if (isLoading) return <LoadingSpinner/>;

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>
            <DataTable
                columns={columns as ColumnDef<Transaction, any>[]}
                data={data}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPagination}
            />
        </div>
    );
}