import React from './React';

// 设置DOM属性
function setAttributes(dom, props) {
    Object.keys(props)
        .filter(key => key !== "children")
        .forEach(name => {
            const value = props[name];

            if (name === 'className') {
                dom.setAttribute('class', value);
            }
            else if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, value);
            }
            else if (name === 'style' && typeof value === 'object') {
                Object.assign(dom.style, value);
            }
            else if (typeof value === 'boolean') {
                value ? dom.setAttribute(name, '') : dom.removeAttribute(name);
            }
            else {
                dom.setAttribute(name, value);
            }
        });
}

// 创建组件元素
function createComponentElement(element) {
    const { type: Component, props } = element;

    // 检查Component是否有效
    if (typeof Component !== 'function') {
        console.error('Invalid component type:', Component);
        return { type: 'TEXT_ELEMENT', props: { nodeValue: '' } };
    }

    // 处理函数组件
    if (!Component.prototype || !Component.prototype.isReactComponent) {
        try {
            return Component(props);
        } catch (error) {
            console.error('Function component error:', error);
            return { type: 'TEXT_ELEMENT', props: { nodeValue: '' } };
        }
    }

    // 处理类组件
    try {
        const instance = new Component(props);
        if (typeof instance.render !== 'function') {
            throw new Error('Class component missing render method');
        }
        const renderedElement = instance.render();
        renderedElement._instance = instance;
        instance._currentElement = renderedElement;
        return renderedElement;
    } catch (error) {
        console.error('Class component error:', error);
        return { type: 'TEXT_ELEMENT', props: { nodeValue: '' } };
    }
}

// 渲染实现
function render(element, container) {
    console.log(element, container);
    if (!container || !container.nodeType) {
        console.error('Invalid container:', container);
        return;
    }

    // 清空容器
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // 内部渲染函数
    function _render(element, parentDom) {
        if (!element) return null;

        // 处理组件
        if (typeof element.type === 'function') {
            const componentElement = createComponentElement(element);
            return _render(componentElement, parentDom);
        }

        // 创建DOM节点
        const dom = element.type === "TEXT_ELEMENT"
            ? document.createTextNode(element.props.nodeValue || "")
            : document.createElement(element.type);

        // 设置属性
        if (element.type !== "TEXT_ELEMENT") {
            setAttributes(dom, element.props);
        }

        // 递归渲染子元素
        if (element.props.children) {
            element.props.children.forEach(child => {
                const childDom = _render(child, dom);
                if (childDom) dom.appendChild(childDom);
            });
        }

        // 保存DOM引用
        if (element._instance) {
            element._instance._currentDOM = dom;
        }

        parentDom.appendChild(dom);
        return dom;
    }

    _render(element, container);
}

const ReactDOM = {
    render,
    // 可以添加其他ReactDOM API
};

export default ReactDOM;