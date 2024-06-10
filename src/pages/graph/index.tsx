'use client';

import {useEffect, useRef, useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {SnackbarProvider, useSnackbar} from 'notistack';
import {cytoscapeLayoutOptions} from "../../configs/cytoscapeConfig";
import {useFetchGraph} from "../../hooks/useFetchGraphData";
import SearchForm from "../../components/SearchForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import {setupPopper} from "../../configs/setupPopper";

const GraphPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<{ start: string, end: string }>({start: '', end: ''});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const {graph, isLoading, error, fetchGraphData} = useFetchGraph();
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (searchTerm) {
            fetchGraphData(searchTerm, timeRange);
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

    const handleNodeClick = (nodeId: string) => {
        window.location.href = `/address/${nodeId}`;
    };

    const handleEdgeClick = (edgeId: string) => {
        window.open(`https://cardanoscan.io/transaction/${edgeId}`, '_blank');
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#0a0d16'
            }}>
                <SearchForm
                    onSubmit={handleFormSubmit}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    searchInputRef={searchInputRef}
                />
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    <CytoscapeComponent
                        elements={CytoscapeComponent.normalizeElements(graph)}
                        style={{width: '80%', height: '600px', backgroundColor: '#0a0d16'}}
                        layout={cytoscapeLayoutOptions}
                        cy={(cy) => {
                            cy.on('tap', 'node', (event) => {
                                const nodeId = event.target.id();
                                handleNodeClick(nodeId);
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
        </SnackbarProvider>
    );
};

export default GraphPage;