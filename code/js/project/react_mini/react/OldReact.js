
const React={
    createElement,
    render
}
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.flat().map(child =>
                typeof child === "object" ? child : createTextElement(child)
            ),
        },
    };
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}
function setAttributes(dom, props) {
    if (dom.nodeType === Node.TEXT_NODE) return;
    if (typeof props !== "object" || props === null) return;
    if (!dom || dom.nodeType !== Node.ELEMENT_NODE || !props) return;
    Object.keys(props)
        .filter(key => key !== "children")
        .forEach(name => {
            // 特殊属性处理
            if (name === 'className') {
                // class 属性特殊处理
                dom.setAttribute('class', props[name]);
            } else if (name === 'htmlFor') {
                // for 属性特殊处理（React 使用 htmlFor 代替 for）
                dom.setAttribute('for', props[name]);
            } else if (name.startsWith('on') && typeof props[name] === 'function') {
                // 事件处理
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, props[name]);
            } else if (name === 'style' && typeof props[name] === 'object') {
                // style 对象处理
                Object.assign(dom.style, props[name]);
            } else if (typeof props[name] === 'boolean') {
                // 布尔属性处理
                if (props[name]) {
                    dom.setAttribute(name, '');
                } else {
                    dom.removeAttribute(name);
                }
            } else if (name === 'dangerouslySetInnerHTML') {
                // 危险地设置 HTML
                if (props[name] && props[name].__html) {
                    dom.innerHTML = props[name].__html;
                }
            } else {
                // 默认情况使用 setAttribute
                dom.setAttribute(name, props[name]);
            }
        });
}
// 简单的渲染函数
function render(element, container) {
    const dom =
        element.type === "TEXT_ELEMENT"
            ? document.createTextNode(element.props.nodeValue)
            : document.createElement(element.type);
    // 设置属性
    Object.keys(element.props)
        .filter(key => key !== "children")
        .forEach(name => {
            // 特殊处理 className（因为 DOM 属性是 className 而 HTML 属性是 class）
            if (name === 'className') {
                dom.setAttribute('class', element.props[name]);
                return;
            }

            // 处理事件（以 on 开头的属性）
            if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, element.props[name]);
                return;
            }

            // 处理 style 对象
            if (name === 'style' && typeof element.props[name] === 'object') {
                const styleObj = element.props[name];
                Object.keys(styleObj).forEach(styleName => {
                    dom.style[styleName] = styleObj[styleName];
                });
                return;
            }

            // 布尔属性特殊处理（如 disabled, checked 等）
            if (typeof element.props[name] === 'boolean') {
                if (element.props[name]) {
                    dom.setAttribute(name, '');
                } else {
                    dom.removeAttribute(name);
                }
                return;
            }
            console.log(name, element.props[name]);
            // 默认情况使用 setAttribute
            if (element.type !== "TEXT_ELEMENT") {
                setAttributes(dom, element.props);

                dom.setAttribute(name, element.props[name]);
            }

        });

    // 递归渲染子元素
    element.props.children.forEach(child => render(child, dom));

    container.appendChild(dom);
}



export  default React;