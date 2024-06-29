'use client';

import React, {useCallback, useEffect, useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {fetchApi} from "@/utils/api-client";
import {useToast} from "@/hooks/use-toast";
import {cytoscapeLayoutOptions} from "@/configs/cytoscape";
import AddressDetails from "@/components/address-details";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Alert} from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {cytoscapeStylesheet} from "@/app/graph/cytoscapeStylesheet";

interface PageProps {
    params: { hash: string }
}

const AddressGraphPage: React.FC<PageProps> = ({params}) => {
    const [elements, setElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    const {toast} = useToast();
    const {hash} = params;

    useEffect(() => {
        const fetchGraphData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchApi(`/graph/addresses/${hash}`);
                const cyElements = [
                    ...data.nodes.map((node: any) => ({
                        data: {id: node.id, ...node},
                        classes: node.type
                    })),
                    ...data.edges.map((edge: any) => ({
                        data: {
                            source: edge.from_address,
                            target: edge.to_address,
                            type: edge.type,
                            label: edge.type
                        }
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
        return <LoadingSpinner/>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Address Graph for {hash}</h1>
            {elements.length > 0 ? (
                <CytoscapeComponent
                    elements={elements}
                    style={{width: '100%', height: '800px'}}
                    layout={cytoscapeLayoutOptions}
                    stylesheet={cytoscapeStylesheet}
                    cy={(cy) => {
                        cy.on('tap', 'node', handleNodeClick);
                    }}
                />
            ) : (
                <Alert variant="destructive" title="No Data"/>
            )}

            <Sheet open={isSliderOpen} onOpenChange={setIsSliderOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedNode?.type} Details</SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                        {selectedNode?.type === 'Address' &&
                            <AddressDetails address={selectedNode} onClose={() => setIsSliderOpen(false)}/>}
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default AddressGraphPage;