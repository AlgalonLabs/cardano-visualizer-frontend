import React from 'react';
import {Button} from "@/components/ui/button";
import CircularDisplay from "@/components/ui/circular-display";
import InfoCard from "@/components/ui/info-card";
import DetailRow from "@/components/ui/detail-row";
import {Epoch} from "@/types/epoch";
import {useRouter} from "next/navigation";

interface EpochDetailsProps {
    epoch: Epoch;
}

const EpochDetails: React.FC<EpochDetailsProps> = ({epoch}) => {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push(`/epochs/${epoch.no}`);
    };

    return (

        <div className="space-y-6 py-4">
            <div className="text-center">
                <CircularDisplay value={epoch.no} label="Epoch"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InfoCard value={epoch.blk_count} label="Blocks"/>
                <InfoCard value={epoch.tx_count} label="Transactions"/>
            </div>

            <div className="space-y-2">
                <DetailRow
                    label="Epoch Number"
                    value={epoch.no}
                />
                <DetailRow
                    label="Start Time"
                    value={new Date(epoch.start_time).toLocaleString()}
                />
                <DetailRow
                    label="End Time"
                    value={new Date(epoch.end_time).toLocaleString()}
                />
                <DetailRow
                    label="Total Output"
                    value={`${epoch.out_sum.toFixed(2)} ₳`}
                />
                <DetailRow
                    label="Total Fees"
                    value={`${epoch.fees.toFixed(2)} ₳`}
                />
            </div>

            <div className="pt-4">
                <Button className="w-full" onClick={handleViewDetails}>View more details</Button>
            </div>
        </div>
    );
};

export default EpochDetails;