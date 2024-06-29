import React from 'react';
import {useFetchAssetDetails} from "../../hooks";

interface AssetDetailsProps {
    assetId: string;
    onClose: () => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ assetId, onClose }) => {
    const { assetDetails, isLoading, error, fetchAssetDetails } = useFetchAssetDetails();

    React.useEffect(() => {
        fetchAssetDetails(assetId);
    }, [assetId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <button onClick={onClose} style={{ float: 'right', marginBottom: '10px' }}>Close</button>
            <h2>Asset Details</h2>
            {assetDetails && (
                <div>
                    <p>Asset ID: {assetDetails.assetId}</p>
                    <p>Policy: {assetDetails.policy}</p>
                    <p>Name: {assetDetails.name}</p>
                    <p>Quantity: {assetDetails.quantity}</p>
                    {/* Render other assets details */}
                </div>
            )}
        </div>
    );
};

export default AssetDetails;