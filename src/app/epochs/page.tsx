'use client'

import React, { useEffect, useState } from 'react';
import { columns, Epoch } from './columns';
import { DataTable } from "@/app/epochs/data-table";
import { PaginationState } from '@tanstack/react-table';

const EpochsPage: React.FC = () => {
  const [epochs, setEpochs] = useState<Epoch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={epochs}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalCount={totalCount}
        onPageChange={setPagination}
      />
    </div>
  );
};

export default EpochsPage;