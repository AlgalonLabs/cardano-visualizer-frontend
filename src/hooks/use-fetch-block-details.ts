import { useState } from 'react';
import axios from 'axios';
import { BlockDetails } from '../types';  // Assuming you have defined this type

export const useFetchBlockDetails = () => {
    const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBlockDetails = async (blockHash: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8002/block/${blockHash}`);
            setBlockDetails(response.data);
        } catch (error) {
            setError('Failed to fetch blocks details.');
            console.error('Error fetching blocks details', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { blockDetails, isLoading, error, fetchBlockDetails };
};