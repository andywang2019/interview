"use client"

// 全局状态
let currentComponent = null
let hookIndex = 0
let rootContainer = null
let rootElement = null
let isRendering = false
let scheduled = false;
let passiveScheduled = false;

// 组件实例存储 - 使用组件函数的名称和位置作为 key
const componentInstances = new Map()

// 生成组件唯一标识
function getComponentKey(Component, props) {
    // 使用组件函数名称作为基础 key
    return Component.name || "Anonymous"
}

// 组件实例结构
function createComponentInstance() {
    return {
        hooks: [],
        effects: [],
        component: null,
        props: null,
    }
}

// 执行副作用
function executeEffects(instance) {
    instance.effects.forEach((effect) => {
        setTimeout(() => {
            try {
                const cleanup = effect.callback()
                if (typeof cleanup === "function") {
                    if (instance.hooks[effect.index]) {
                        instance.hooks[effect.index].cleanup = cleanup
                    }
                }
            } catch (error) {
                console.error("Effect execution error:", error)
            }
        }, 0)
    })
}

// 设置DOM属性
function setAttributes(dom, props) {
    Object.keys(props)
        .filter((key) => key !== "children")
        .forEach((name) => {
            const value = props[name]
            if (name === "ref") {
                if (value && typeof value === "object" && "current" in value) {
                    value.current = dom
                }
            } else if (name === "className") {
                dom.setAttribute("class", value)
            } else if (name.startsWith("on")) {
                const eventType = name.toLowerCase().substring(2)
                console.log("Binding event:", eventType, "to element:", dom.tagName)
                dom.addEventListener(eventType, (e) => {
                    console.log("Event triggered:", eventType, "on", dom.tagName)
                    value(e)
                })
            } else if (name === "style" && typeof value === "object") {
                Object.assign(dom.style, value)
            } else if (typeof value === "boolean") {
                value ? dom.setAttribute(name, "") : dom.removeAttribute(name)
            } else {
                dom.setAttribute(name, value)
            }
        })
}

// 创建组件元素
function createComponentElement(element) {
    const { type: Component, props } = element

    if (typeof Component !== "function") {
        console.error("Invalid component type:", Component)
        return { type: "TEXT_ELEMENT", props: { nodeValue: "" } }
    }

    // 处理函数组件
    if (!Component.prototype || !Component.prototype.isReactComponent) {
        // 使用组件函数和位置生成唯一 key
        const componentKey = getComponentKey(Component, props)
        let instance = componentInstances.get(componentKey)

        if (!instance) {
            console.log("Creating new instance for component:", componentKey)
            instance = createComponentInstance()
            componentInstances.set(componentKey, instance)
        } else {
            console.log("Reusing existing instance for component:", componentKey, "hooks count:", instance.hooks.length)
        }

        instance.component = Component
        instance.props = props

        // 设置当前组件上下文
        currentComponent = instance
        hookIndex = 0
        instance.effects = []

        try {
            console.log(
                "Rendering component:",
                componentKey,
                "current hooks state:",
                instance.hooks.map((h) => h.state),
            )
            const result = Component(props)
            // 执行副作用
            executeEffects(instance)
            return result
        } catch (error) {
            console.error("Function component error:", error)
            return { type: "TEXT_ELEMENT", props: { nodeValue: "" } }
        } finally {
            currentComponent = null
            hookIndex = 0
        }
    }

    // 处理类组件
    try {
        const instance = new Component(props)
        if (typeof instance.render !== "function") {
            throw new Error("Class component missing render method")
        }
        const renderedElement = instance.render()
        renderedElement._instance = instance
        instance._currentElement = renderedElement
        return renderedElement
    } catch (error) {
        console.error("Class component error:", error)
        return { type: "TEXT_ELEMENT", props: { nodeValue: "" } }
    }
}

// 渲染实现
function render(element, container) {
    console.log("ReactDOM.render called with element:", element, "container:", container)

    if (!container || !container.nodeType) {
        console.error("Invalid container:", container)
        return
    }

    // 保存根容器和元素，用于重新渲染
    rootContainer = container
    rootElement = element

    console.log("Set rootContainer:", rootContainer, "rootElement:", rootElement)

    // 清空容器
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }

    isRendering = true
    _render(element, container)
    isRendering = false
}

function _render(element, container) {
    if (!element) return

    if (typeof element.type === "function") {
        element = createComponentElement(element)
        _render(element, container)
        return
    }

    const dom =
        element.type === "TEXT_ELEMENT"
            ? document.createTextNode(element.props.nodeValue)
            : document.createElement(element.type)

    if (element.type !== "TEXT_ELEMENT") {
        setAttributes(dom, element.props)
    }

    const children = element.props.children || []
    children.forEach((child) => _render(child, dom))

    container.appendChild(dom)

    if (element._instance) {
        element._instance._currentDOM = dom
    }

    return dom
}

function executeEffects(instance) {
    const effects = instance.effects || [];
    instance.effects = [];                   // 先取出并清空
    effects.sort((a,b) => a.index - b.index); // 按声明顺序稳定执行

    for (const eff of effects) {
        const hook = instance.hooks[eff.index];
        // 先清理上一次
        if (hook && typeof hook.cleanup === "function") {
            try { hook.cleanup(); } catch (e) { console.error("cleanup error:", e); }
            hook.cleanup = null;
        }
        // 执行本次 effect，并保存新的 cleanup
        try {
            const ret = eff.callback?.();
            if (typeof ret === "function") hook.cleanup = ret;
        } catch (e) {
            console.error("effect error:", e);
        }
    }
}
function schedulePassiveEffectsFlush() {
    if (passiveScheduled) return;
    passiveScheduled = true;

    requestAnimationFrame(() => {
        setTimeout(() => {           // rAF 到下一帧，再丢到宏任务：大概率在 paint 之后
            passiveScheduled = false;
            flushEffectsPhase();       // <— 这里统一调用 executeEffects
        }, 0);
    });
}

function flushEffectsPhase() {
    // 如果维护了脏实例集合，可只遍历脏的；这里演示全量
    for (const [, inst] of componentInstances) {
        executeEffects(inst);
    }
}


// 调度重新渲染
function scheduleRerender(instance) {
    console.log("scheduleRerender called with instance:", instance)

    if (isRendering) {
        console.log("Already rendering, skipping rerender")
        return
    }

    if (!rootContainer) {
        console.error("rootContainer is not initialized. Make sure ReactDOM.render has been called.")
        return
    }

    if (!rootElement) {
        console.error("rootElement is not initialized. Make sure ReactDOM.render has been called.")
        return
    }

    setTimeout(() => {
        console.log("Executing rerender...")
        console.log(
            "Component instances before rerender:",
            Array.from(componentInstances.entries()).map(([key, inst]) => ({
                key,
                hooks: inst.hooks.map((h) => h.state),
            })),
        )

        try {
            // 清空容器
            while (rootContainer.firstChild) {
                rootContainer.removeChild(rootContainer.firstChild)
            }

            console.log("Re-rendering application...")
            isRendering = true
            // 重新渲染整个应用
            _render(rootElement, rootContainer)
            isRendering = false
            console.log("Re-render complete")

            console.log(
                "Component instances after rerender:",
                Array.from(componentInstances.entries()).map(([key, inst]) => ({
                    key,
                    hooks: inst.hooks.map((h) => h.state),
                })),
            )
        } catch (error) {
            console.error("Error during re-render:", error)
            isRendering = false
        }
        // —— 提交后再安排被动 effects（尽量在下一帧绘制后） ——
      schedulePassiveEffectsFlush();
    }, 0)
}

const ReactDOM = {
    render,
}

// 导出供 React.js 使用的函数
if (typeof window !== "undefined") {
    window.scheduleRerender = scheduleRerender
    window.getCurrentComponent = () => currentComponent
    window.setCurrentComponent = (component) => {
        currentComponent = component
    }
    window.getHookIndex = () => hookIndex
    window.setHookIndex = (index) => {
        hookIndex = index
    }
    window.componentInstances = componentInstances
    window.createComponentInstance = createComponentInstance
    window.executeEffects = executeEffects
}

export default ReactDOM
