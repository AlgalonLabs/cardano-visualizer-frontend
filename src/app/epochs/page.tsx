'use client'

import React, {useEffect, useState} from 'react';
import {columns} from './columns';
import {DataTable} from "@/app/epochs/data-table";
import {CellContext, ColumnDef, PaginationState} from '@tanstack/react-table';
import {Sheet, SheetContent} from "@/components/ui/sheet";
import EpochDetails from "@/components/details/epoch-details";
import {Epoch} from "@/types/epoch";

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
                    {selectedEpoch && <EpochDetails epoch={selectedEpoch}/>}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default EpochsPage;