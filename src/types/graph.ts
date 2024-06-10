export interface NodeData {
    id: string;
    label: string;
}

export interface EdgeData {
    id: string;
    source: string;
    target: string;
    value: number;
    timestamp: string;
    tx_hash: string;
}

export interface GraphElement {
    data: NodeData | EdgeData;
    style?: {
        [key: string]: string | number;
    };
}

export interface TimeRange {
    start: string;
    end: string;
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
