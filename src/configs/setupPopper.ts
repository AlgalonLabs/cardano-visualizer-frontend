import { tippyFactory } from './tippyFactory';
import { Core, EdgeSingular } from 'cytoscape';
import { EdgeData } from '../types';

export const setupPopper = (cy: Core) => {
    cy.on('mouseover', 'edge', (event) => {
        const edge = event.target as EdgeSingular;
        const ref = edge.popperRef();
        const content = document.createElement('div');
        content.innerHTML = `${(edge.data() as EdgeData).value} ADA`;
        content.style.backgroundColor = 'black';
        content.style.color = 'white';
        content.style.padding = '5px';
        content.style.borderRadius = '1px';

        const tip = tippyFactory(ref, content);
        tip.show();

        const updatePosition = (e: MouseEvent) => {
            const rect = {
                x: e.clientX,
                y: e.clientY,
                width: 0,
                height: 0,
                top: e.clientY,
                left: e.clientX,
                bottom: e.clientY,
                right: e.clientX,
                toJSON: () => rect,
            };

            ref.getBoundingClientRect = () => rect;

            if (tip && tip.popperInstance) {
                tip.popperInstance.update();
            }
        };

        edge.on('mousemove', (e) => updatePosition(e.originalEvent as MouseEvent));

        (edge as any).on('mouseout', () => {
            if (tip) {
                tip.destroy();
            }
        }, { once: true });
    });
};