import { useState } from 'react';
import axios from 'axios';
import { EpochDetails } from '../types';  // Assuming you have defined this type

export const useFetchEpochDetails = () => {
    const [epochDetails, setEpochDetails] = useState<EpochDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEpochDetails = async (epochNo: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8002/epoch/${epochNo}`);
            setEpochDetails(response.data);
        } catch (error) {
            setError('Failed to fetch epoch details.');
            console.error('Error fetching epoch details', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { epochDetails, isLoading, error, fetchEpochDetails };
};