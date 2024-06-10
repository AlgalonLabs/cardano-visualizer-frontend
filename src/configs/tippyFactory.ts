import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export function tippyFactory(ref: any, content: HTMLElement) {
    const dummyDomEle = document.createElement('div');

    const tip = tippy(dummyDomEle, {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: 'manual',
        content: content,
        arrow: true,
        placement: 'bottom',
        hideOnClick: false,
        sticky: 'reference',
        interactive: true,
        appendTo: document.body,
    });

    return tip;
}