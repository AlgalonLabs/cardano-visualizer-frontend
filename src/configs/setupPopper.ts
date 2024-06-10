import {tippyFactory} from './tippyFactory';
import {Core, EdgeSingular} from "cytoscape";
import {EdgeData} from "../types";

export const setupPopper = (cy: Core) => {
    cy.on('mouseover', 'edge', (event) => {
        const edge = event.target as EdgeSingular;
        const ref = edge.popperRef();
        const content = document.createElement('div');
        content.innerHTML = `Value: ${(edge.data() as EdgeData).value} ADA`;
        content.style.backgroundColor = 'black';
        content.style.color = 'white';
        content.style.padding = '5px';
        content.style.borderRadius = '5px';

        const tip = tippyFactory(ref, content);

        tip.show();

        const updatePosition = async (e: MouseEvent) => {
            const rect = {
                x: e.clientX,
                y: e.clientY,
                width: 0,
                height: 0,
                top: e.clientY,
                left: e.clientX,
                bottom: e.clientY,
                right: e.clientX,
                toJSON: () => rect
            };

            ref.getBoundingClientRect = () => rect;

            if (tip && tip.popperInstance) {
                await tip.popperInstance.update();
            }
        };

        document.addEventListener('mousemove', updatePosition);

        (edge as any).on('mouseout', () => {
            tip.destroy();
            document.removeEventListener('mousemove', updatePosition);
        }, {once: true});
    });
};