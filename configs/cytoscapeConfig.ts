import cytoscape, {EdgeSingular, NodeSingular} from "cytoscape";
import cytoscapePopper from "cytoscape-popper";
import fcose, {FcoseLayoutOptions} from "cytoscape-fcose";
// @ts-ignore
import layoutUtilities from 'cytoscape-layout-utilities';
import {tippyFactory} from "./tippyFactory";


cytoscape.use(cytoscapePopper(tippyFactory));
cytoscape.use(fcose);
cytoscape.use(layoutUtilities);

export const cytoscapeLayoutOptions: FcoseLayoutOptions = {
    name: 'fcose',
    quality: 'default',
    randomize: true,
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 30,
    nodeDimensionsIncludeLabels: false,
    uniformNodeDimensions: false,
    packComponents: true,
    step: 'all',
    samplingType: true,
    sampleSize: 25,
    nodeSeparation: 75,
    piTol: 0.0000001,
    nodeRepulsion: (node: NodeSingular) => 7000,
    idealEdgeLength: (edge: EdgeSingular) => 300,
    edgeElasticity: (edge: EdgeSingular) => 0.45,
    nestingFactor: 0.1,
    numIter: 2500,
    tile: true,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
    gravity: 0.25,
    gravityRangeCompound: 1.5,
    gravityCompound: 1.0,
    gravityRange: 3.8,
    initialEnergyOnIncremental: 0.3
}

