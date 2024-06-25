'use client'

import React, {useEffect, useState} from 'react';
import {columns, Epoch} from './columns';
import {DataTable} from "@/app/epochs/data-table";
import {CellContext, ColumnDef, PaginationState} from '@tanstack/react-table';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";

type CellType<T> = string | ((props: CellContext<T, unknown>) => React.ReactNode);

const EpochsPage: React.FC = () => {
    const [epochs, setEpochs] = useState<Epoch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [totalCount, setTotalCount] = useState(0);
    const [selectedEpoch, setSelectedEpoch] = useState<Epoch | null>(null);
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    useEffect(() => {
        async function fetchEpochs() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8002/epochs?skip=${pagination.pageIndex * pagination.pageSize}&limit=${pagination.pageSize}`
                );
                const data = await response.json();
                setEpochs(data.epochs);
                setTotalCount(data.total_count);
            } catch (error) {
                console.error('Failed to fetch epochs', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEpochs();
    }, [pagination]);

    const handleRowClick = (epoch: Epoch) => {
        setSelectedEpoch(epoch);
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

    const enhancedColumns: ColumnDef<Epoch>[] = columns.map(column => ({
        ...column,
        cell: (props) => {
            const cellContent = (column.cell as CellType<Epoch>);
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
                data={epochs}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                totalCount={totalCount}
                onPageChange={setPagination}
            />
            <Sheet open={isSliderOpen} onOpenChange={setIsSliderOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Epoch Details</SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                        {selectedEpoch && (
                            <div className="space-y-4">
                                <p><strong>Epoch Number:</strong> {selectedEpoch.no}</p>
                                <p><strong>Start Time:</strong> {new Date(selectedEpoch.start_time).toLocaleString()}
                                </p>
                                <p><strong>End Time:</strong> {new Date(selectedEpoch.end_time).toLocaleString()}</p>
                                <p><strong>Block Count:</strong> {selectedEpoch.blk_count}</p>
                                <p><strong>Transaction Count:</strong> {selectedEpoch.tx_count}</p>
                                <p><strong>Total Output:</strong> {selectedEpoch.out_sum.toFixed(2)} ₳</p>
                                <p><strong>Total Fees:</strong> {selectedEpoch.fees.toFixed(2)} ₳</p>
                            </div>
                        )}
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default EpochsPage;