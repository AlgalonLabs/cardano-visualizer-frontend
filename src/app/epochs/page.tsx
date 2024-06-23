'use client';

import React, { useEffect, useState } from 'react';
import { columns, Epoch } from './columns';
import {DataTable} from "@/app/epochs/data-table";

const EpochsPage: React.FC = () => {
  const [epochs, setEpochs] = useState<Epoch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEpochs() {
      try {
        const response = await fetch('http://localhost:8002/epochs');
        const data = await response.json();
        setEpochs(data);
      } catch (error) {
        console.error('Failed to fetch epochs', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEpochs();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={epochs} />
    </div>
  );
};

export default EpochsPage;