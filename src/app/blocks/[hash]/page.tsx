'use client'

import React, {useEffect, useState} from 'react';
import DetailCard from '@/components/detail-card';
import {Skeleton} from "@/components/ui/skeleton";

interface BlockDetails {
    block: {
        tx_count: number;
        size: number;
        proto_major: number;
        proto_minor: number;
        previous_id: number;
        epoch_no: number;
        time: string;
        id: number;
        slot_leader_id: number;
        hash: string;
    };
    transactions: any[]; // You might want to define a more specific type for transactions
    epoch: {
        out_sum: number;
        start_time: string;
        no: number;
        fees: number;
        end_time: string;
    };
}

const BlockDetailsPage = ({params}: { params: { hash: string } }) => {
    const {hash} = params;
    const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (hash) {
            fetch(`http://localhost:8002/blocks/${hash}`)
                .then((response) => response.json())
                .then((data) => {
                    setBlockDetails(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Failed to fetch block details', error);
                    setIsLoading(false);
                });
        }
    }, [hash]);

    if (isLoading) {
        return <Skeleton className="w-full h-[200px]"/>;
    }

    if (!blockDetails) {
        return <div>No details available for this block.</div>;
    }

    const {block, epoch} = blockDetails;

    const blockInfo = [
        {label: "Block Hash", value: block.hash},
        {label: "Block ID", value: block.id},
        {label: "Timestamp", value: new Date(block.time).toLocaleString()},
        {label: "Epoch", value: block.epoch_no},
        {label: "Size", value: `${block.size} bytes`},
        {label: "Transaction Count", value: block.tx_count},
        {label: "Slot Leader ID", value: block.slot_leader_id},
        {label: "Previous Block ID", value: block.previous_id},
    ];

    const epochInfo = [
        {label: "Epoch Number", value: epoch.no},
        {label: "Start Time", value: new Date(epoch.start_time).toLocaleString()},
        {label: "End Time", value: new Date(epoch.end_time).toLocaleString()},
        {label: "Total Output", value: `₳ ${epoch.out_sum.toLocaleString()}`},
        {label: "Total Fees", value: `₳ ${epoch.fees.toLocaleString()}`},
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Block Details for {hash}</h1>
            <div className="space-y-4">
                <DetailCard title="Block Information" details={blockInfo}/>
                <DetailCard title="Epoch Information" details={epochInfo}/>
            </div>
        </div>
    );
};

export default BlockDetailsPage;