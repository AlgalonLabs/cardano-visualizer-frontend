'use client';

import React, {useEffect, useRef, useState} from 'react';
import {SnackbarProvider, useSnackbar} from 'notistack';
import AddressDetails from "@/components/address-details";
import AssetDetails from "@/components/asset-details";
import TransactionDetails from "@/components/transaction-details";
import BlockDetails from "@/components/block-details";
import EpochDetails from "@/components/epoch-details";
import {useFetchGraph} from "@/hooks";
import SearchForm from "@/components/ui/search-form";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {cytoscapeLayoutOptions} from "@/configs/cytoscape";
import {popper} from "@/configs/popper";
import CytoscapeComponent from "react-cytoscapejs";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const GraphPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<[number, number]>([Date.now() - 30 * 24 * 60 * 60 * 1000, Date.now()]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const {graph, isLoading, error, fetchGraphData} = useFetchGraph();
    const {enqueueSnackbar} = useSnackbar();
    const [sidebarContent, setSidebarContent] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (searchTerm) {
            const resourceType = determineResourceType(searchTerm);
            fetchGraphData(searchTerm, {
                start: new Date(timeRange[0]).toISOString(),
                end: new Date(timeRange[1]).toISOString()
            }, resourceType)
                .then(r => r)
                .catch(e => e);
        }
    }, [searchTerm, timeRange]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, {variant: 'error'});
        }
    }, [error, enqueueSnackbar]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchInputRef.current!.value);
    };

    const determineResourceType = (term: string): string => {
        // Implement logic to determine resource type based on the search term
        // This is a simplified example and may need to be adjusted based on your specific requirements
        if (term.startsWith('addr')) return 'address';
        if (term.length === 64) return 'transaction';
        if (term.length === 56) return 'block';
        if (!isNaN(Number(term))) return 'epoch';
        return 'asset';
    };

    const handleNodeClick = (nodeId: string, nodeType: string) => {
        switch (nodeType) {
            case 'Address':
                setSidebarContent(<AddressDetails address={nodeId} onClose={() => setSidebarContent(null)}/>);
                break;
            case 'Asset':
                setSidebarContent(<AssetDetails assetId={nodeId} onClose={() => setSidebarContent(null)}/>);
                break;
            case 'Block':
                setSidebarContent(<BlockDetails blockHash={nodeId} onClose={() => setSidebarContent(null)}/>);
                break;
            case 'Epoch':
                setSidebarContent(<EpochDetails epochNumber={nodeId} onClose={() => setSidebarContent(null)}/>);
                break;
            default:
                break;
        }
    };

    const handleEdgeClick = (edgeId: string) => {
        setSidebarContent(<TransactionDetails txHash={edgeId} onClose={() => setSidebarContent(null)}/>);
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                <div style={{padding: '10px'}}>
                    <SearchForm onSubmit={handleFormSubmit} searchInputRef={searchInputRef}/>
                </div>
                <div style={{display: 'flex', flexGrow: 1}}>
                    <div style={{flex: 3}}>
                        {isLoading ? (
                            <LoadingSpinner/>
                        ) : (
                            <CytoscapeComponent
                                elements={CytoscapeComponent.normalizeElements(graph)}
                                style={{width: '100%', height: '100%'}}
                                layout={cytoscapeLayoutOptions}
                                cy={(cy) => {
                                    cy.on('tap', 'node', (event) => {
                                        const nodeId = event.target.id();
                                        const nodeType = event.target.data('type');
                                        handleNodeClick(nodeId, nodeType);
                                    });
                                    cy.on('tap', 'edge', (event) => {
                                        const edgeId = event.target.id();
                                        handleEdgeClick(edgeId);
                                    });

                                    popper(cy);

                                    cy.on('layoutstop', () => {
                                        cy.center();
                                        cy.fit();
                                    });
                                }}
                            />
                        )}
                    </div>
                    <div style={{flex: 1, padding: '10px'}}>
                        {sidebarContent}
                    </div>
                </div>
                <div style={{padding: '20px'}}>
                    <Slider
                        range
                        min={Date.now() - 365 * 24 * 60 * 60 * 1000}
                        max={Date.now()}
                        value={timeRange}
                        onChange={(value: [number, number]) => setTimeRange(value)}
                        tipFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                </div>
            </div>
        </SnackbarProvider>
    );
};

export default GraphPage;