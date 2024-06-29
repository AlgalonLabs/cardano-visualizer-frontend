import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";

interface UTXO {
    address: string;
    stake_address: string;
    amount: string;
}

interface TransactionDetails {
    id: string;
    input_address: string;
    output_address: string;
    created_at: string;
    confirmation: number;
    total_output: string;
    fee: string;
    block: string;
    slot: number;
    absolute_slot: number;
    inputs: UTXO[];
    outputs: UTXO[];
}

interface TransactionDetailsProps {
    transactionHash: string;
}

const TransactionDetailsComponent: React.FC<TransactionDetailsProps> = ({transactionHash}) => {
    const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {toast} = useToast();

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/transaction/${transactionHash}`);
                setTransaction(data);
            } catch (error) {
                console.error('Failed to fetch transaction details:', error);
                setError('Failed to load transaction details. Please try again later.');
                toast({
                    title: "Error",
                    description: "Failed to load transaction details. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [transactionHash, toast]);

    if (isLoading) return <LoadingSpinner/>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!transaction) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Transaction Details</h2>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">SUCCESS</span>
            </div>
            <p className="text-sm break-all">{transaction.id}</p>
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Input</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs break-all">{transaction.input_address}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs break-all">{transaction.output_address}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Created At</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{transaction.created_at}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Confirmation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{transaction.confirmation}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Total output</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{transaction.total_output} A</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Transaction Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{transaction.fee} A</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Block</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{transaction.block}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Slot - Absolute Slot</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{transaction.slot} - {transaction.absolute_slot}</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>UTXOs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Input Addresses</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transaction.inputs.map((input, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <p className="text-xs break-all">{input.address}</p>
                                        <p className="text-xs text-gray-500">Stake Address: {input.stake_address}</p>
                                    </TableCell>
                                    <TableCell>{input.amount} A</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Table className="mt-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Output Addresses</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transaction.outputs.map((output, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <p className="text-xs break-all">{output.address}</p>
                                        <p className="text-xs text-gray-500">Stake Address: {output.stake_address}</p>
                                    </TableCell>
                                    <TableCell>{output.amount} A</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionDetailsComponent;