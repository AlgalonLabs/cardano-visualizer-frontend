'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {ClipboardIcon} from '@heroicons/react/24/outline';
import Link from "next/link";

interface UTXOInfo {
    address: string;
    stake_address?: string;
    amount: number;
    utxo_hash: string;
    utxo_index: number;
}

interface TransactionDetails {
    hash: string;
    created_at: string;  // ISO 8601 date string
    total_output: number;
    fee: number;
    block_number?: number;
    slot?: number;
    absolute_slot?: number;
    inputs: UTXOInfo[];
    outputs: UTXOInfo[];
}

interface PageProps {
    params: { hash: string }
}

const TransactionDetailsPage: React.FC<PageProps> = ({params}) => {
    const [transactionData, setTransactionData] = useState<TransactionDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {toast} = useToast();

    const {hash} = params;

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/transactions/${hash}`);
                setTransactionData(data);
            } catch (error) {
                console.error('Failed to fetch transactions details:', error);
                toast({
                    title: "Error",
                    description: "Failed to load transactions details. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [hash, toast]);

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 8)}...${address.slice(-8)}`;
    };


    const copyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to clipboard",
                description: "The text has been copied to your clipboard.",
            });
        });
    };

    if (isLoading) return <LoadingSpinner/>;
    if (!transactionData) return <div>No data available</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Transaction Details</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Transaction Hash</p>
                            <div className="bg-blue-50 p-2 rounded-md flex justify-between items-center">
                                <p className="text-sm break-all">{transactionData.hash}</p>
                                <button onClick={() => copyToClipboard(transactionData.hash)}
                                        className="text-blue-500 hover:text-blue-600">
                                    <ClipboardIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold">Created At</p>
                            <p>{new Date(transactionData.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Total Output</p>
                            <p>{transactionData.total_output} ADA</p>
                        </div>
                        <div>
                            <p className="font-semibold">Transaction Fees</p>
                            <p>{transactionData.fee} ADA</p>
                        </div>
                        <div>
                            <p className="font-semibold">Block</p>
                            <p>{transactionData.block_number}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Slot - Absolute Slot</p>
                            <p>{transactionData.slot} - {transactionData.absolute_slot}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Inputs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Address</TableHead>
                                <TableHead>Stake Address</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>UTXO Hash</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionData.inputs.map((input, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Link href={`/addresses/${input.address}`}
                                                  className="text-blue-500 hover:underline">
                                                {shortenAddress(input.address)}
                                            </Link>
                                            <button onClick={() => copyToClipboard(input.address)}
                                                    className="ml-2 text-blue-500 hover:text-blue-600">
                                                <ClipboardIcon className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {input.stake_address && (
                                            <div className="flex items-center">
                                                <Link href={`/addresses/${input.stake_address}`}
                                                      className="text-blue-500 hover:underline">
                                                    {shortenAddress(input.stake_address)}
                                                </Link>
                                                <button onClick={() => copyToClipboard(input.stake_address)}
                                                        className="ml-2 text-blue-500 hover:text-blue-600">
                                                    <ClipboardIcon className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{input.amount} ADA</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Link href={`/transactions/${input.utxo_hash}`}
                                                  className="text-blue-500 hover:underline">
                                                {shortenAddress(input.utxo_hash)}
                                            </Link>
                                            <button onClick={() => copyToClipboard(input.utxo_hash)}
                                                    className="ml-2 text-blue-500 hover:text-blue-600">
                                                <ClipboardIcon className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Outputs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Address</TableHead>
                                <TableHead>Stake Address</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionData.outputs.map((output, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Link href={`/addresses/${output.address}`}
                                                  className="text-blue-500 hover:underline">
                                                {shortenAddress(output.address)}
                                            </Link>
                                            <button onClick={() => copyToClipboard(output.address)}
                                                    className="ml-2 text-blue-500 hover:text-blue-600">
                                                <ClipboardIcon className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {output.stake_address && (
                                            <div className="flex items-center">
                                                <Link href={`/addresses/${output.stake_address}`}
                                                      className="text-blue-500 hover:underline">
                                                    {shortenAddress(output.stake_address)}
                                                </Link>
                                                <button onClick={() => copyToClipboard(output.stake_address)}
                                                        className="ml-2 text-blue-500 hover:text-blue-600">
                                                    <ClipboardIcon className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{output.amount} ADA</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionDetailsPage;