import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/utils/api-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface AddressDetail {
    id: string;
    transactions: number;
    balance: string;
    value: string;
    stake_address: string;
    total_stake: string;
    pool_name: string | null;
    reward_balance: string;
}

interface AddressDetailsProps {
    addressHash: string;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({ addressHash }) => {
    const [address, setAddress] = useState<AddressDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAddressDetails = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/addresses/${addressHash}`);
                setAddress(data);
            } catch (error) {
                console.error('Failed to fetch address details:', error);
                toast({
                    title: "Error",
                    description: "Failed to load address details. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddressDetails();
    }, [addressHash, toast]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
            </div>
        );
    }

    if (!address) return null;

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Address</h3>
                            <p className="text-sm font-bold truncate">{address.id}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
                            <p className="text-sm font-bold">{address.transactions}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">ADA Balance</h3>
                            <p className="text-sm font-bold">{address.balance} ₳</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">ADA Value</h3>
                            <p className="text-sm font-bold">${address.value}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Stake Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-medium text-gray-400">Total Stake</h4>
                            <p className="text-sm font-bold">{address.total_stake} ₳</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-gray-400">Pool Name</h4>
                            <p className="text-sm font-bold">{address.pool_name || 'Not delegated'}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-gray-400">Reward Balance</h4>
                            <p className="text-sm font-bold">{address.reward_balance} ₳</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Link href={`/addresses/${address.id}`} passHref>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        See more details
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default AddressDetails;