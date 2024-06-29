export const cytoscapeStylesheet = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'ellipsis',
            'text-max-width': '100px',
            'font-size': '10px',
            'width': '30px',
            'height': '30px'
        }
    },
    {
        selector: 'node.Address',
        style: {
            'background-color': '#A7C7E7', // Light pastel blue
            'label': function (ele) {
                const id = ele.data('id');
                return id.substring(0, 6) + '...' + id.substring(id.length - 4);
            }
        }
    },
    {
        selector: 'node.Transaction',
        style: {
            'background-color': '#FFD8B1', // Light pastel orange
            'label': function (ele) {
                const hash = ele.data('id');
                return hash.substring(0, 6) + '...' + hash.substring(hash.length - 4);
            }
        }
    },
    {
        selector: 'node.Block',
        style: {
            'background-color': '#B1F0B1', // Light pastel green
            'label': function (ele) {
                return 'Block ' + ele.data('block_no');
            }
        }
    },
    {
        selector: 'node.Epoch',
        style: {
            'background-color': '#D7BDE2', // Light pastel purple
            'label': function (ele) {
                return 'Epoch ' + ele.data('no');
            }
        }
    },
    {
        selector: 'node.UTXO',
        style: {
            'background-color': '#FFF0F5', // Lavender blush
            'label': function (ele) {
                const id = ele.data('id');
                return 'UTXO ' + id.substring(0, 4) + '...' + id.substring(id.length - 4);
            }
        }
    },
    {
        selector: 'node.StakeAddress',
        style: {
            'background-color': '#E6E6FA', // Lavender
            'label': function (ele) {
                const id = ele.data('id');
                return 'Stake ' + id.substring(0, 4) + '...' + id.substring(id.length - 4);
            }
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'label': 'data(type)',
            'font-size': '8px',
            'text-rotation': 'autorotate',
            'text-margin-y': -10
        }
    },
    {
        selector: 'edge[type="INPUT"]',
        style: {
            'line-color': '#FFB3BA', // Light pastel red
            'target-arrow-color': '#FFB3BA',
        }
    },
    {
        selector: 'edge[type="OUTPUT"]',
        style: {
            'line-color': '#BAFFC9', // Light pastel green
            'target-arrow-color': '#BAFFC9',
        }
    },
    {
        selector: 'edge[type="OWNS"]',
        style: {
            'line-color': '#BAE1FF', // Light pastel blue
            'target-arrow-color': '#BAE1FF',
        }
    },
    {
        selector: 'edge[type="STAKE"]',
        style: {
            'line-color': '#E6E6FA', // Lavender
            'target-arrow-color': '#E6E6FA',
        }
    },
    {
        selector: 'edge[type="CONTAINED_BY"]',
        style: {
            'line-color': '#FFFFBA', // Light pastel yellow
            'target-arrow-color': '#FFFFBA',
        }
    }
];