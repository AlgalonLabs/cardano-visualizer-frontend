import { useState } from 'react';
import axios from 'axios';
import { TransactionDetails } from '../types';

export const useFetchTransactionDetails = () => {
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactionDetails = async (transactionHash: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8002/transaction/${transactionHash}`);
            setTransactionDetails(response.data);
        } catch (error) {
            setError('Failed to fetch transaction details.');
            console.error('Error fetching transaction details', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { transactionDetails, isLoading, error, fetchTransactionDetails };
};