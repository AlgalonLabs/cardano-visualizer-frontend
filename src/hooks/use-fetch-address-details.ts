import { useState } from 'react';
import axios from 'axios';
import { AddressDetails } from '../types';

export const useFetchAddressDetails = () => {
    const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAddressDetails = async (address: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8002/address/${address}`);
            setAddressDetails(response.data);
        } catch (error) {
            setError('Failed to fetch address details.');
            console.error('Error fetching address details', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { addressDetails, isLoading, error, fetchAddressDetails };
};