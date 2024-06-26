'use client'

import React, {useEffect, useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {fetchApi} from "@/utils/api-client";
import {Loader2} from "lucide-react"
import {useToast} from "@/hooks/use-toast"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

interface PageProps {
    params: { hash: string }
}

const BlockGraphPage = ({params}: PageProps) => {
    const [elements, setElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {toast} = useToast()
    const {hash} = params;

    useEffect(() => {
        const fetchGraphData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/graph/blocks/${hash}`);

                const cyElements = [
                    ...data.nodes.map((node: any) => ({
                        data: {id: node.id, ...node},
                        classes: node.type
                    })),
                    ...data.edges.map((edge: any) => ({
                        data: {source: edge.from_address, target: edge.to_address, type: edge.type}
                    }))
                ];

                setElements(cyElements);
            } catch (error) {
                console.error('Failed to fetch graph data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load graph data. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false);
            }
        };

        fetchGraphData();
    }, [hash, toast]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-16 w-16 animate-spin"/>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Block Graph for {hash}</h1>
            {elements.length > 0 ? (
                <CytoscapeComponent
                    elements={elements}
                    style={{width: '100%', height: '600px'}}
                    layout={{name: 'cose'}}
                    stylesheet={[
                        {
                            selector: 'node',
                            style: {
                                'background-color': '#666',
                                'label': 'data(id)'
                            }
                        },
                        {
                            selector: 'node.Block',
                            style: {
                                'background-color': '#6FB1FC'
                            }
                        },
                        {
                            selector: 'node.Transaction',
                            style: {
                                'background-color': '#EDA1ED'
                            }
                        },
                        {
                            selector: 'node.Epoch',
                            style: {
                                'background-color': '#86B342'
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'width': 3,
                                'line-color': '#ccc',
                                'target-arrow-color': '#ccc',
                                'target-arrow-shape': 'triangle'
                            }
                        }
                    ]}
                />
            ) : (
                <Alert variant="destructive">
                    <AlertTitle>No Data</AlertTitle>
                    <AlertDescription>
                        No graph data available for this block.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default BlockGraphPage;