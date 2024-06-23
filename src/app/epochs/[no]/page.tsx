'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EpochDetailsPage = ({ params }: { params: { no: string } }) => {
  const router = useRouter();
  const { no } = params
  const [epochDetails, setEpochDetails] = useState(null);
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
    return <div>Loading...</div>;
  }

  if (!epochDetails) {
    return <div>No details available for this epoch.</div>;
  }

  return (
    <div>
      <h1>Epoch Details for {no}</h1>
      <pre>{JSON.stringify(epochDetails, null, 2)}</pre>
    </div>
  );
};

export default EpochDetailsPage;