'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface AddressData {
    id: string;
    transactions: number;
    balance: string;
    value: string;
    stake_address: string;
    total_stake: string;
    pool_name: string | null;
    reward_balance: string;
    highest_balance: string;
    lowest_balance: string;
    balance_history: { time: string; balance: number }[];
    recent_transactions: {
        tx_hash: string;
        timestamp: string;
        amount: string;
        type: 'incoming' | 'outgoing';
    }[];
}

interface PageProps {
    params: { address: string }
}

const FullAddressDetailsPage: React.FC<PageProps> = ({params}) => {
    const [addressData, setAddressData] = useState<AddressData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {toast} = useToast();

    useEffect(() => {
        const fetchAddressData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/addresses/${params.address}`);
                setAddressData(data);
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

        fetchAddressData();
    }, [params.address, toast]);

    if (isLoading) return <LoadingSpinner/>;
    if (!addressData) return <div>No data available</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Address Details</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Address:</span> {addressData.id}</p>
                            <p><span className="font-semibold">Total Transactions:</span> {addressData.transactions}</p>
                            <p><span className="font-semibold">Current Balance:</span> {addressData.balance} ADA</p>
                            <p><span className="font-semibold">Value:</span> ${addressData.value}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Balance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={addressData.balance_history}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="time"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="balance" stroke="#8884d8"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm">
                            <p><span className="font-semibold">Highest Balance:</span> {addressData.highest_balance} ADA
                            </p>
                            <p><span className="font-semibold">Lowest Balance:</span> {addressData.lowest_balance} ADA
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Staking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Stake Address:</span> {addressData.stake_address}</p>
                            <p><span className="font-semibold">Total Stake:</span> {addressData.total_stake} ADA</p>
                            <p><span
                                className="font-semibold">Pool Name:</span> {addressData.pool_name || 'Not delegated'}
                            </p>
                            <p><span className="font-semibold">Reward Balance:</span> {addressData.reward_balance} ADA
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {addressData.recent_transactions.map((tx, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{tx.type}</TableCell>
                                        <TableCell>{tx.amount} ADA</TableCell>
                                        <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FullAddressDetailsPage;