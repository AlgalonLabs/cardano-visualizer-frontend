import { useState } from 'react';
import axios from 'axios';
import { AssetDetails } from '../types';  // Assuming you have defined this type

export const useFetchAssetDetails = () => {
    const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAssetDetails = async (assetId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8002/asset/${assetId}`);
            setAssetDetails(response.data);
        } catch (error) {
            setError('Failed to fetch asset details.');
            console.error('Error fetching asset details', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { assetDetails, isLoading, error, fetchAssetDetails };
};