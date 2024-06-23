'use client';

import React, { useEffect, useState } from 'react';
import { columns, Block } from './columns';
import {DataTable} from "@/app/blocks/data-table";

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const response = await fetch('http://localhost:8002/blocks');
        const data = await response.json();
        setBlocks(data);
      } catch (error) {
        console.error('Failed to fetch blocks', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlocks();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={blocks} />
    </div>
  );
};

export default BlocksPage;