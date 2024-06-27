'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { fetchApi } from "@/utils/api-client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner, Alert, Sheet } from "@/components/ui";
import { cytoscapeLayoutOptions } from "@/configs/cytoscape";
import AddressDetails from "@/components/address-details";

interface PageProps {
    params: { hash: string }
}

const AddressGraphPage: React.FC<PageProps> = ({ params }) => {
    const [elements, setElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    const { toast } = useToast();
    const { hash } = params;

    useEffect(() => {
        const fetchGraphData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/graph/addresses/${hash}`);
                const cyElements = [
                    ...data.nodes.map((node: any) => ({
                        data: { id: node.id, ...node },
                        classes: node.type
                    })),
                    ...data.edges.map((edge: any) => ({
                        data: { source: edge.from_address, target: edge.to_address, type: edge.type }
                    }))
                ];
                setElements(cyElements);
            } catch (error) {
                console.error('Failed to fetch graph data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load graph data. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchGraphData();
    }, [hash, toast]);

    const handleNodeClick = useCallback((event: any) => {
        const node = event.target.data();
        setSelectedNode(node);
        setIsSliderOpen(true);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Address Graph for {hash}</h1>
            {elements.length > 0 ? (
                <CytoscapeComponent
                    elements={elements}
                    style={{ width: '100%', height: '600px' }}
                    layout={cytoscapeLayoutOptions}
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
                            selector: 'node.Address',
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

                    cy={(cy) => {
                        cy.on('tap', 'node', handleNodeClick);
                    }}
                />
            ) : (
                <Alert variant="destructive" title="No Data" description="No graph data available for this address." />
            )}

            <Sheet open={isSliderOpen} onOpenChange={setIsSliderOpen}>
                <Sheet.Content>
                    <Sheet.Header>
                        <Sheet.Title>{selectedNode?.type} Details</Sheet.Title>
                    </Sheet.Header>
                    <Sheet.Description>
                        {selectedNode?.type === 'Address' && <AddressDetails address={selectedNode} />}
                    </Sheet.Description>
                </Sheet.Content>
            </Sheet>
        </div>
    );
};

export default AddressGraphPage;