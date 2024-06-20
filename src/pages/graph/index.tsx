'use client';

import React, { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { cytoscapeLayoutOptions } from "../../configs/cytoscapeConfig";
import { useFetchGraph } from "../../hooks/useFetchGraphData";
import SearchForm from "../../components/SearchForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { setupPopper } from "../../configs/setupPopper";
import AddressDetails from "../../components/details/AddressDetails";
import AssetDetails from "../../components/details/AssetDetails";
import TransactionDetails from "../../components/details/TransactionDetails";

const GraphPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<{ start: string, end: string }>({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const { graph, isLoading, error, fetchGraphData } = useFetchGraph();
    const { enqueueSnackbar } = useSnackbar();
    const [sidebarContent, setSidebarContent] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (searchTerm) {
            fetchGraphData(searchTerm, timeRange).then(r => r).catch(e => e);
        }
    }, [searchTerm, timeRange]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
    }, [error, enqueueSnackbar]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchInputRef.current!.value);
    };

    const handleNodeClick = (nodeId: string, nodeType: string) => {
        if (nodeType === 'Address') {
            setSidebarContent(<AddressDetails address={nodeId} onClose={() => setSidebarContent(null)} />);
        } else if (nodeType === 'Asset') {
            setSidebarContent(<AssetDetails assetId={nodeId} onClose={() => setSidebarContent(null)} />);
        }
    };

    const handleEdgeClick = (edgeId: string) => {
        setSidebarContent(<TransactionDetails txHash={edgeId} onClose={() => setSidebarContent(null)} />);
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100vh',
                backgroundColor: '#0a0d16'
            }}>
                <div style={{ flex: 3 }}>
                    <SearchForm
                        onSubmit={handleFormSubmit}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        searchInputRef={searchInputRef}
                    />
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <CytoscapeComponent
                            elements={CytoscapeComponent.normalizeElements(graph)}
                            style={{ width: '100%', height: '100%' }}
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

                                setupPopper(cy);

                                cy.on('layoutstop', () => {
                                    cy.center();
                                    cy.fit();
                                });
                            }}
                        />
                    )}
                </div>
                <div style={{ flex: 1, padding: '10px', backgroundColor: '#1e2230', color: '#fff' }}>
                    {sidebarContent}
                </div>
            </div>
        </SnackbarProvider>
    );
};

export default GraphPage;