import {NodeSingular, Stylesheet} from "cytoscape";

export const cytoscapeStylesheet: Stylesheet[] = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'ellipsis',
            'text-max-width': '100px',
            'font-size': '12px',
            'width': '40px',
            'height': '40px',
            'border-width': 2,
            'border-color': '#000'
        }
    },
    {
        selector: 'node.Address',
        style: {
            'background-color': '#A7C7E7',
            'shape': 'round-rectangle',
            'label': function (ele: NodeSingular) {
                const id = ele.data('id');
                return id.substring(0, 6) + '...' + id.substring(id.length - 4);
            }
        }
    },
    {
        selector: 'node.Transaction',
        style: {
            'background-color': '#FFD8B1',
            'shape': 'diamond',
            'label': function (ele: NodeSingular) {
                const hash = ele.data('id');
                return hash.substring(0, 6) + '...' + hash.substring(hash.length - 4);
            }
        }
    },
    {
        selector: 'node.UTXO',
        style: {
            'background-color': '#FFF0F5',
            'shape': 'ellipse',
            'label': function (ele: NodeSingular) {
                const id = ele.data('id');
                return 'UTXO ' + id.substring(0, 4) + '...' + id.substring(id.length - 4);
            }
        }
    },
    {
        selector: 'node.StakeAddress',
        style: {
            'background-color': '#E6E6FA',
            'shape': 'octagon',
            'label': function (ele: NodeSingular) {
                const id = ele.data('id');
                return 'Stake ' + id.substring(0, 4) + '...' + id.substring(id.length - 4);
            }
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'label': 'data(type)',
            'font-size': '10px',
            'text-rotation': 'autorotate',
            'text-margin-y': -10
        }
    },
    {
        selector: 'edge[type="INPUT"]',
        style: {
            'line-color': '#FFB3BA', // Light pastel red
            'target-arrow-color': '#FFB3BA',
            'target-arrow-shape': 'triangle',
        }
    },
    {
        selector: 'edge[type="OUTPUT"]',
        style: {
            'line-color': '#BAFFC9', // Light pastel green
            'target-arrow-color': '#BAFFC9',
            'target-arrow-shape': 'triangle',
        }
    },
    {
        selector: 'edge[type="OWNS"]',
        style: {
            'line-color': '#BAE1FF', // Light pastel blue
            'target-arrow-color': '#BAE1FF',
            'target-arrow-shape': 'triangle',
        }
    },
    {
        selector: 'edge[type="STAKE"]',
        style: {
            'line-color': '#E6E6FA', // Lavender
            'target-arrow-color': '#E6E6FA',
            'target-arrow-shape': 'triangle',
        }
    },
    {
        selector: 'edge[type="CONTAINED_BY"]',
        style: {
            'line-color': '#FFFFBA', // Light pastel yellow
            'target-arrow-color': '#FFFFBA',
            'target-arrow-shape': 'triangle',
        }
    }
];