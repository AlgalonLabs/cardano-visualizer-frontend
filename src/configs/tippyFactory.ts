import tippy, { roundArrow } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';

tippy.setDefaultProps({
    plugins: [followCursor],
});

export function tippyFactory(ref: any, content: HTMLElement) {
    const dummyDomEle = document.createElement('div');

    const tip = tippy(dummyDomEle, {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: 'manual',
        content: content,
        arrow: roundArrow,
        placement: 'bottom',
        hideOnClick: false,
        followCursor: true,
        interactive: true,
        appendTo: document.body,
    });

    return tip;
}