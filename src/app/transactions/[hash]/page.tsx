'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, ClipboardIcon} from 'lucide-react';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {shortenAddress} from "@/utils/address";
import {UTXOInfo, TransactionDetails} from "@/types/transaction";
import {calculateTotal} from "@/utils/transactions";

interface PageProps {
    params: { hash: string }
}

const TransactionDetailsPage: React.FC<PageProps> = ({params}) => {
    const [transactionData, setTransactionData] = useState<TransactionDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const {toast} = useToast();

    const {hash} = params;

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/transactions/${hash}`);
                setTransactionData(data);
            } catch (error) {
                console.error('Failed to fetch transaction details:', error);
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
    }, [hash, toast]);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to clipboard",
                description: "The text has been copied to your clipboard.",
            });
        });
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
    };



    if (isLoading) return <LoadingSpinner/>;
    if (!transactionData) return <div>No data available</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-4">
                <ArrowLeftIcon className="h-6 w-6 mr-2 cursor-pointer" onClick={() => { /* Add navigation logic */
                }}/>
                <h1 className="text-2xl font-bold">Transaction Details</h1>
            </div>

            <Card className="mb-8">
                <CardHeader className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center">
                            {shortenAddress(transactionData.hash)}
                            <ClipboardIcon
                                className="ml-2 h-5 w-5 cursor-pointer"
                                onClick={() => copyToClipboard(transactionData.hash)}
                            />
                        </CardTitle>
                        <span
                            className={`text-sm ${transactionData.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}`}>
                            {transactionData.status}
                        </span>
                    </div>
                    <div className="bg-blue-500 text-white rounded-full p-2 text-center">
                        <div className="text-2xl font-bold">{transactionData.epoch}</div>
                        <div className="text-xs">Epoch</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Input</p>
                            <p>{shortenAddress(transactionData.inputs[0].address)}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Output</p>
                            <p>{shortenAddress(transactionData.outputs[0].address)}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Created At</p>
                            <p>{new Date(transactionData.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Confirmations</p>
                            <p>{transactionData.confirmations}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Total Output</p>
                            <p>{transactionData.totalOutput} A</p>
                        </div>
                        <div>
                            <p className="font-semibold">Transaction Fees</p>
                            <p>{transactionData.fee} A</p>
                        </div>
                        <div>
                            <p className="font-semibold">Block</p>
                            <p>{transactionData.blockNumber}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Slot - Absolute Slot</p>
                            <p>{transactionData.slot} - {transactionData.absoluteSlot}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Collapsible>
                        <CollapsibleTrigger className="w-full" onClick={() => toggleSection('summary')}>
                            <div className="flex justify-between items-center">
                                <span>View Summary</span>
                                {expandedSections['summary'] ? <ChevronUpIcon className="h-5 w-5"/> :
                                    <ChevronDownIcon className="h-5 w-5"/>}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="mt-4 space-y-4">
                                {transactionData.inputs.map((input, index) => (
                                    <TransactionSummaryItem
                                        key={index}
                                        address={input.address}
                                        sent={input.amount}
                                        received={0}
                                    />
                                ))}
                                {transactionData.outputs.map((output, index) => (
                                    <TransactionSummaryItem
                                        key={index}
                                        address={output.address}
                                        sent={0}
                                        received={output.amount}
                                    />
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>UTXOs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Collapsible>
                        <CollapsibleTrigger className="w-full" onClick={() => toggleSection('inputs')}>
                            <div className="flex justify-between items-center">
                                <span>Inputs</span>
                                {expandedSections['inputs'] ? <ChevronUpIcon className="h-5 w-5"/> :
                                    <ChevronDownIcon className="h-5 w-5"/>}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <UTXOTable utxos={transactionData.inputs} type="input"/>
                        </CollapsibleContent>
                    </Collapsible>
                    <Collapsible className="mt-4">
                        <CollapsibleTrigger className="w-full" onClick={() => toggleSection('outputs')}>
                            <div className="flex justify-between items-center">
                                <span>Outputs</span>
                                {expandedSections['outputs'] ? <ChevronUpIcon className="h-5 w-5"/> :
                                    <ChevronDownIcon className="h-5 w-5"/>}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <UTXOTable utxos={transactionData.outputs} type="output"/>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>
        </div>
    );
};

const TransactionSummaryItem: React.FC<{ address: string; sent: number; received: number }> = ({
                                                                                                   address,
                                                                                                   sent,
                                                                                                   received
                                                                                               }) => (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
        <ClipboardIcon className="h-8 w-8 text-blue-500"/>
        <div>
            <p className="font-semibold">{shortenAddress(address)}</p>
            <p>ADA Sent: {sent} A</p>
            <p>ADA Received: {received} A</p>
            <p>Tokens Sent: 0</p>
            <p>Tokens Received: 0</p>
        </div>
    </div>
);

const UTXOTable: React.FC<{ utxos: UTXOInfo[]; type: 'input' | 'output' }> = ({utxos, type}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Amount</TableHead>
                {type === 'input' && <TableHead>UTXO Hash</TableHead>}
            </TableRow>
        </TableHeader>
        <TableBody>
            {utxos.map((utxo, index) => (
                <TableRow key={index}>
                    <TableCell>{shortenAddress(utxo.address)}</TableCell>
                    <TableCell>{utxo.amount} A</TableCell>
                    {type === 'input' && utxo.utxo_hash && <TableCell>{shortenAddress(utxo.utxo_hash)}</TableCell>}
                </TableRow>
            ))}
            <TableRow className="font-bold bg-blue-50">
                <TableCell>Total</TableCell>
                <TableCell>{calculateTotal(utxos)} A</TableCell>
                {type === 'input' && <TableCell></TableCell>}
            </TableRow>
        </TableBody>
    </Table>
);

export default TransactionDetailsPage;