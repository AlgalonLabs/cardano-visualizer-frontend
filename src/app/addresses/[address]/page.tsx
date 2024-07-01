'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ApiError, fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {ClipboardIcon} from "lucide-react";

interface AddressData {
    id: string;
    transactions: number;
    balance: string;
    value: string;
    stake_address: string;
    total_stake: string;
    pool_name: string | null;
    reward_balance: string;
}

interface AnalyticsData {
    analytics: { timestamp: string; balance: number }[];
}

interface TransactionData {
    transactions: {
        tx_hash: string;
        timestamp: string;
        fee: string;
        inputs: { address: string; value: string }[];
        outputs: { address: string; value: string }[];
    }[];
}

interface TokenData {
    tokens: {
        policy: string;
        name: string;
        quantity: number;
    }[];
}

interface PageProps {
    params: { address: string }
}

const FullAddressDetailsPage: React.FC<PageProps> = ({params}) => {
    const [addressData, setAddressData] = useState<AddressData | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {toast} = useToast();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to clipboard",
                description: "The address has been copied to your clipboard.",
            });
        });
    };

    useEffect(() => {
        const abortController = new AbortController();
        let isMounted = true;

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [addressResponse, analyticsResponse, transactionResponse, tokenResponse] = await Promise.all([
                    fetchApi(`/addresses/${params.address}`, {signal: abortController.signal}),
                    fetchApi(`/addresses/analytics/${params.address}/ONE_MONTH`, {signal: abortController.signal}),
                    fetchApi(`/addresses/${params.address}/txs?page=0&size=10`, {signal: abortController.signal}),
                    fetchApi(`/addresses/${params.address}/tokens?page=0&size=10`, {signal: abortController.signal})
                ]);

                if (isMounted) {
                    setAddressData(addressResponse);
                    setAnalyticsData(analyticsResponse);
                    setTransactionData(transactionResponse);
                    setTokenData(tokenResponse);
                }
            } catch (error: unknown) {
                if (error instanceof ApiError) {
                    if (error.name !== 'AbortError') {
                        console.error(`API error (status ${error.status}):`, error.message);
                        toast({
                            title: "API Error",
                            description: `Failed to load address details (status ${error.status}). Please try again later.`,
                            variant: "destructive",
                        });
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAllData();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [params.address, toast]);

    if (isLoading) return <LoadingSpinner/>;
    if (!addressData || !analyticsData || !transactionData || !tokenData) return <div>No data available</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Address Details</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                                <p className="text-sm break-all">{addressData.id}</p>
                                <button onClick={() => copyToClipboard(addressData.id)}
                                        className="text-blue-500 hover:text-blue-600">
                                    <ClipboardIcon className="h-5 w-5"/>
                                </button>
                            </div>
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
                                <LineChart data={analyticsData.analytics}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="timestamp"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="balance" stroke="#8884d8"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Staking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                                <p className="text-sm break-all">{addressData.stake_address}</p>
                                <button onClick={() => copyToClipboard(addressData.stake_address)}
                                        className="text-blue-500 hover:text-blue-600">
                                    <ClipboardIcon className="h-5 w-5"/>
                                </button>
                            </div>
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
                                    <TableHead>Transaction Hash</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Fee</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionData.transactions.map((tx, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{tx.tx_hash.substring(0, 10)}...</TableCell>
                                        <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                                        <TableCell>{tx.fee} ADA</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Policy</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tokenData.tokens.map((token, index) => (
                                <TableRow key={index}>
                                    <TableCell>{token.policy.substring(0, 10)}...</TableCell>
                                    <TableCell>{token.name}</TableCell>
                                    <TableCell>{token.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default FullAddressDetailsPage;