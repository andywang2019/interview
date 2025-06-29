
const React={
    createElement,
    render,
    _render
}
function createElement(type, props, ...children) {
    console.log(type, props, ...children)
    return {
        type,
        props,
        children: children.map(child =>
            typeof child === 'object' ? child : createTextElement(child)
        ),
    };
}

function createTextElement(text) {

    return {
        type: 'TEXT_ELEMENT',
        props: { nodeValue: text },
        children: [],
    };
}
function setAttributes(dom, props = {}) {

    if (!props) return;
    Object.keys(props).forEach(name => {

        const value = props[name];

        if (name === 'className') {
            dom.setAttribute('class', value);
        } else if (name === 'style' && typeof value === 'object') {
            Object.assign(dom.style, value);
        } else if (name.startsWith('on')) {
            const event = name.toLowerCase().substring(2);
            dom.addEventListener(event, value);
        } else {
            dom.setAttribute(name, value);
        }
    });
}
function createComponentElement(element)
{
    const {type: Component, props, children} = element;

    if (!Component.prototype?.isReactComponent) {
        // 函数组件
        return Component(props || {});
    }
    // 类组件
    const instance = new Component(props || {});
    const renderedElement = instance.render();
    renderedElement._instance = instance;
    instance._currentElement = renderedElement;
    return renderedElement;
}


function _render(element) {
    if (!element) return document.createTextNode('');

    if (typeof element.type === 'function') {
        const compElement = createComponentElement(element);
        return _render(compElement);
    }

    const { type, props, children } = element;

    const dom =
        type === 'TEXT_ELEMENT'
            ? document.createTextNode(props.nodeValue)
            : document.createElement(type);

    if (type !== 'TEXT_ELEMENT') {
        setAttributes(dom, props);
    }

    (children || []).forEach(child => {
        const childDom = _render(child);
        dom.appendChild(childDom);
    });

    if (element._instance) {
        element._instance._currentDOM = dom;
    }

    return dom;
}

function render(element, container) {
    container.innerHTML = '';
    const dom = _render(element);
    container.appendChild(dom);
    return dom;
}


export  default React;