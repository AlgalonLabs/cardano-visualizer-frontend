import cytoscape from "cytoscape";
import { useState } from 'react';
import axios from 'axios';
import {Graph, Transaction} from "../types";

export const useFetchGraph = (initialState: Graph = { nodes: [], edges: [] }) => {
    const [graph, setGraph] = useState<Graph>(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGraphData = async (address: string, timeRange: { start: string, end: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8001/graph/address/${address}`, {
                params: {
                    start_time: timeRange.start,
                    end_time: timeRange.end
                }
            });
            const data: { transactions: Transaction[] } = response.data;
            const nodesSet = new Set<string>();
            const nodes: cytoscape.ElementDefinition[] = [];
            const edges: cytoscape.ElementDefinition[] = [];

            data.transactions.forEach(tx => {
                if (!nodesSet.has(tx.from)) {
                    nodesSet.add(tx.from);
                    nodes.push({
                        data: {
                            id: tx.from,
                            label: `${tx.from.slice(0, 3)}...${tx.from.slice(-3)}`
                        },
                        style: {
                            'background-color': tx.from === address ? 'blue' : 'grey',
                            'color': 'white',
                            'shape': 'ellipse',
                            'width': 70,
                            'height': 70,
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'font-size': '10px',
                            'text-wrap': 'wrap',
                            'text-max-width': 60,
                            border: '1px solid white'
                        }
                    });
                }

                if (!nodesSet.has(tx.to)) {
                    nodesSet.add(tx.to);
                    nodes.push({
                        data: {
                            id: tx.to,
                            label: `${tx.to.slice(0, 3)}...${tx.to.slice(-3)}`
                        },
                        style: {
                            'background-color': 'grey',
                            'color': 'white',
                            'shape': 'ellipse',
                            'width': 70,
                            'height': 70,
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'font-size': '10px',
                            'text-wrap': 'wrap',
                            'text-max-width': 60,
                            border: '1px solid white'
                        }
                    });
                }

                edges.push({
                    data: {
                        id: tx.tx_hash,
                        source: tx.from,
                        target: tx.to,
                        value: tx.value,
                        timestamp: tx.timestamp,
                        tx_hash: tx.tx_hash
                    },
                    style: {
                        'line-color': tx.from === address ? 'red' : 'green',
                        'width': 3,
                        'target-arrow-shape': 'none',
                    }
                });
            });

            setGraph({ nodes, edges });
        } catch (error) {
            setError('Failed to fetch graph data.');
            console.error('Error fetching graph data', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { graph, isLoading, error, fetchGraphData };
};