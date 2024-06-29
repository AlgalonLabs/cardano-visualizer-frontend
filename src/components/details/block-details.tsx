import {Button} from "@/components/ui/button";
import CircularDisplay from "@/components/ui/circular-display";
import InfoCard from "@/components/ui/info-card";
import DetailRow from "@/components/ui/detail-row";
import {Block} from "@/types/block";
import React from "react";
import {useRouter} from 'next/navigation';

interface BlockDetailsProps {
    block: Block;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({block}) => {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push(`/blocks/${block.hash}`);
    };

    return (
        <div className="space-y-6 py-4">
            <div className="text-center">
                <CircularDisplay value={block.epoch_no} label="Epoch"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InfoCard value={block.block_no} label="Block"/>
                <InfoCard value={`${block.block_no}/${block.slot_no}`} label="Slot"/>
            </div>

            <div className="space-y-2">
                <DetailRow
                    label="Block Id"
                    value={
                        <span className="font-mono text-blue-600">
                            {block.hash.substring(0, 10)}...{block.hash.substring(block.hash.length - 10)}
                        </span>
                    }
                />
                <DetailRow label="Absolute Slot" value={block.epoch_slot_no}/>
                <DetailRow label="Created At" value={new Date(block.time).toLocaleString()}/>
                <DetailRow label="Transaction Count" value={`${block.tx_count} ₳`}/>
                <DetailRow label="Block Size" value={`${block.size} bytes`}/>
            </div>

            <div className="pt-4">
                <Button className="w-full" onClick={handleViewDetails}>View details</Button>
            </div>
        </div>
    );
};

export default BlockDetails;