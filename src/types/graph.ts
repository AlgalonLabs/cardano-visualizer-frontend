export interface EdgeData {
    id: string;
    source: string;
    target: string;
    value: number;
    timestamp: string;
    tx_hash: string;
}

export interface TimeRange {
    start: string;
    end: string;
}

export interface Node {
    id: string;
    type: 'Address' | 'Transaction' | 'StakeAddress';
    label: string;
    tx_hash?: string;
    timestamp?: string;
    value?: number;
}

export interface Edge {
    id: string;
    from_address: string;
    to_address: string;
    type: 'INPUT' | 'OUTPUT' | 'STAKE' | 'OWNS';
    value?: number;
    timestamp?: string;
}

export interface Graph {
    nodes: cytoscape.ElementDefinition[];
    edges: cytoscape.ElementDefinition[];
}

export interface Graph {
    nodes: cytoscape.ElementDefinition[];
    edges: cytoscape.ElementDefinition[];
};

export interface Transaction {
    from: string;
    to: string;
    tx_hash: string;
    value: string;
    timestamp: string;
};
