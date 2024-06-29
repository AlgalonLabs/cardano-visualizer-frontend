'use client'

import React, {useCallback, useEffect, useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {fetchApi} from "@/utils/api-client";
import {Loader2} from "lucide-react"
import {useToast} from "@/hooks/use-toast"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {cytoscapeLayoutOptions} from "@/configs/cytoscape";
import BlockDetails from "@/components/details/block-details";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import EpochDetails from "@/components/details/epoch-details";
import {cytoscapeStylesheet} from "@/app/graph/cytoscapeStylesheet";

interface PageProps {
    params: { hash: string }
}

const BlockGraphPage = ({params}: PageProps) => {
    const [elements, setElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isSliderOpen, setIsSliderOpen] = useState(false);

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

    const handleNodeClick = useCallback((event: any) => {
        const node = event.target.data();
        setSelectedNode(node);
        setIsSliderOpen(true);
    }, []);

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
                    layout={cytoscapeLayoutOptions}
                    stylesheet={cytoscapeStylesheet}
                    cy={(cy) => {
                        cy.on('tap', 'node', handleNodeClick);
                    }}
                />
            ) : (
                <Alert variant="destructive">
                    <AlertTitle>No Data</AlertTitle>
                    <AlertDescription>
                        No graph data available for this block.
                    </AlertDescription>
                </Alert>
            )}

            <Sheet open={isSliderOpen} onOpenChange={setIsSliderOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedNode?.type} Details</SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                        {selectedNode?.type === 'Block' && <BlockDetails block={selectedNode}/>}
                        {selectedNode?.type === 'Epoch' && <EpochDetails epoch={selectedNode}/>}
                        {selectedNode?.type === 'Transaction' && (
                            <div>
                                <p><strong>Transaction Hash:</strong> {selectedNode.hash}</p>
                                {/* Add more transaction details as needed */}
                            </div>
                        )}
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default BlockGraphPage;