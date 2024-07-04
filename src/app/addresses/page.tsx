'use client'

import React, { useEffect, useState } from 'react';
import { columns } from './columns';
import { DataTable } from "./data-table";
import { PaginationState, OnChangeFn } from '@tanstack/react-table';
import { AddressRow, AddressResponse } from "@/types/address";

const AddressesPage: React.FC = () => {
    const [addresses, setAddresses] = useState<AddressRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        async function fetchAddresses() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/addresses?page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}`
                );
                const data: AddressResponse = await response.json();
                setAddresses(data.addresses);
                setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
            } catch (error) {
                console.error('Failed to fetch addresses', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAddresses();
    }, [pagination]);

    const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
        setPagination((old) => {
            return typeof updater === 'function' ? updater(old) : updater;
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Addresses</h1>
            <DataTable<AddressRow>
                columns={columns}
                data={addresses}
                pagination={pagination}
                setPagination={handlePaginationChange}
                pageCount={pageCount}
            />
        </div>
    );
};

export default AddressesPage;