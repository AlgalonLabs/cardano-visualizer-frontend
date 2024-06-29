'use client'

import React, { useEffect, useState } from 'react';
import DetailCard from '@/components/ui/detail-card';
import { Skeleton } from "@/components/ui/skeleton";

interface EpochDetails {
  epoch: {
    out_sum: number;
    start_time: string;
    no: number;
    fees: number;
    end_time: string;
  };
}

const EpochDetailsPage = ({ params }: { params: { no: string } }) => {
  const { no } = params;
  const [epochDetails, setEpochDetails] = useState<EpochDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (no) {
      fetch(`http://localhost:8002/epochs/${no}`)
        .then((response) => response.json())
        .then((data) => {
          setEpochDetails(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch epoch details', error);
          setIsLoading(false);
        });
    }
  }, [no]);

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  if (!epochDetails) {
    return <div>No details available for this epoch.</div>;
  }

  const { epoch } = epochDetails;

  const epochDetailProps = [
    { label: "Epoch Number", value: epoch.no },
    { label: "Start Time", value: new Date(epoch.start_time).toLocaleString() },
    { label: "End Time", value: new Date(epoch.end_time).toLocaleString() },
    { label: "Total Output", value: `₳ ${epoch.out_sum.toLocaleString()}` },
    { label: "Total Fees", value: `₳ ${epoch.fees.toLocaleString()}` },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Epoch Details for {no}</h1>
      <DetailCard title="Epoch Information" details={epochDetailProps} />
    </div>
  );
};

export default EpochDetailsPage;