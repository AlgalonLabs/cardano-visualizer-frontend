import cytoscape from "cytoscape";
import { useState } from 'react';
import axios from 'axios';
import { Graph, Node, Edge } from "../types";  // Assuming you have defined these types

export const useFetchGraph = (initialState: Graph = { nodes: [], edges: [] }) => {
    const [graph, setGraph] = useState<Graph>(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGraphData = async (address: string, timeRange: { start: string, end: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8002/graph/address/${address}`, {
                params: {
                    start_time: timeRange.start,
                    end_time: timeRange.end
                }
            });
            const data: { nodes: Node[], edges: Edge[] } = response.data;
            const nodesSet = new Set<string>();
            const nodes: cytoscape.ElementDefinition[] = [];
            const edges: cytoscape.ElementDefinition[] = [];

            data.nodes.forEach(node => {
                if (!nodesSet.has(node.id)) {
                    nodesSet.add(node.id);
                    const nodeStyle = getNodeStyle(node, address);
                    nodes.push({
                        data: {
                            id: node.id,
                            label: node.label
                        },
                        style: nodeStyle
                    });
                }
            });

            data.edges.forEach(edge => {
                edges.push({
                    data: {
                        id: `${edge.from_address}-${edge.to_address}`,
                        source: edge.from_address,
                        target: edge.to_address,
                        value: edge.value,
                        timestamp: edge.timestamp,
                        type: edge.type
                    },
                    style: getEdgeStyle(edge, address)
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

// Helper functions to get node and edge styles
const getNodeStyle = (node: Node, address: string): cytoscape.Css.Node => {
    const isSelected = node.id === address;

    switch (node.type) {
        case 'Address':
            return {
                'background-color': isSelected ? '#FF4500' : '#A9A9A9',  // Orange for selected, grey otherwise
                'color': '#FFFFFF',
                'shape': 'ellipse',
                'width': 70,
                'height': 70,
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': '10px',
                'text-wrap': 'wrap',
                border: '1px solid #FFFFFF'
            };
        case 'Transaction':
            return {
                'background-color': isSelected ? '#FFD700' : '#FFA500',  // Gold for selected, orange otherwise
                'color': '#FFFFFF',
                'shape': 'rectangle',
                'width': 50,
                'height': 50,
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': '10px',
                'text-wrap': 'wrap',
                border: '1px solid #FFFFFF'
            };
        case 'StakeAddress':
            return {
                'background-color': isSelected ? '#8A2BE2' : '#800080',  // BlueViolet for selected, purple otherwise
                'color': '#FFFFFF',
                'shape': 'diamond',
                'width': 70,
                'height': 70,
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': '10px',
                'text-wrap': 'wrap',
                border: '1px solid #FFFFFF'
            };
        default:
            return {};
    }
};

const getEdgeStyle = (edge: Edge, address: string): cytoscape.Css.Edge => {
    return {
        'line-color': edge.from_address === address ? '#DC143C' : '#32CD32',  // Crimson for selected, LimeGreen otherwise
        'width': 3,
        'target-arrow-shape': 'none'
    };
};