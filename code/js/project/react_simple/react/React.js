import { Component } from './Component';




// 组件实例结构
function createComponentInstance() {
    return {
        hooks: [], // 钩子数组
        effects: [], // 副作用数组
        element: null, // DOM 元素
        component: null, // 组件函数
        props: null, // 组件属性
    }
}
export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === 'object' ? child : createTextElement(child))
        }
    };
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    };
}


// useState 实现
function useState(initialState) {
    // 从 ReactDOM 获取当前组件上下文
    const currentComponent = window.getCurrentComponent()
    if (!currentComponent) {
        throw new Error("useState must be called inside a component")
    }

    const instance = currentComponent
    const index = window.getHookIndex()
    window.setHookIndex(index + 1)

    // 初始化钩子
    if (instance.hooks[index] === undefined) {
        instance.hooks[index] = {
            state: typeof initialState === "function" ? initialState() : initialState,
            queue: [],
        }
    }

    const hook = instance.hooks[index]

    // 处理状态更新队列
    hook.queue.forEach((action) => {
        hook.state = typeof action === "function" ? action(hook.state) : action
    })
    hook.queue = []

    const setState = (action) => {
        hook.queue.push(action)
        // 触发重新渲染
        window.scheduleRerender(instance)
    }

    return [hook.state, setState]
}

// useReducer 实现
function useReducer(reducer, initialArg, init) {
    const currentComponent = window.getCurrentComponent()
    if (!currentComponent) {
        throw new Error("useReducer must be called inside a component")
    }

    const instance = currentComponent
    const index = window.getHookIndex()
    window.setHookIndex(index + 1)

    // 初始化钩子
    if (instance.hooks[index] === undefined) {
        const initialState = init ? init(initialArg) : initialArg
        instance.hooks[index] = {
            state: initialState,
            queue: [],
        }
    }

    const hook = instance.hooks[index]

    // 处理状态更新队列
    hook.queue.forEach((action) => {
        hook.state = reducer(hook.state, action)
    })
    hook.queue = []

    const dispatch = (action) => {
        hook.queue.push(action)
        // 触发重新渲染
        window.scheduleRerender(instance)
    }

    return [hook.state, dispatch]
}

// useEffect 实现
function useEffect(callback, dependencies) {
    const currentComponent = window.getCurrentComponent()
    if (!currentComponent) {
        throw new Error("useEffect must be called inside a component")
    }

    const instance = currentComponent
    const index = window.getHookIndex()
    window.setHookIndex(index + 1)

    // 初始化钩子
    if (instance.hooks[index] === undefined) {
        instance.hooks[index] = {
            callback,
            dependencies,
            cleanup: null,
            hasRun: false,
        }
    }

    const hook = instance.hooks[index]
    const prevDependencies = hook.dependencies

    // 检查依赖项是否改变
    const hasChanged =
        !hook.hasRun ||
        !dependencies ||
        !prevDependencies ||
        dependencies.length !== prevDependencies.length ||
        dependencies.some((dep, i) => !Object.is(dep, prevDependencies[i]))

    if (hasChanged) {
        // 清理上一个副作用
        if (hook.cleanup && typeof hook.cleanup === "function") {
            hook.cleanup()
            hook.cleanup = null
        }

        // 更新钩子信息
        hook.callback = callback
        hook.dependencies = dependencies ? [...dependencies] : null

        // 将副作用加入队列，在渲染完成后执行
        instance.effects.push({
            index,
            callback,
            dependencies,
        })

        hook.hasRun = true
    }
}

// useMemo 实现
function useMemo(factory, dependencies) {
    const currentComponent = window.getCurrentComponent()
    if (!currentComponent) {
        throw new Error("useMemo must be called inside a component")
    }

    const instance = currentComponent
    const index = window.getHookIndex()
    window.setHookIndex(index + 1)

    // 初始化钩子
    if (instance.hooks[index] === undefined) {
        const value = factory()
        instance.hooks[index] = {
            value,
            dependencies: dependencies ? [...dependencies] : null,
        }
        return value
    }

    const hook = instance.hooks[index]
    const prevDependencies = hook.dependencies

    // 检查依赖项是否改变
    const hasChanged =
        !dependencies ||
        !prevDependencies ||
        dependencies.length !== prevDependencies.length ||
        dependencies.some((dep, i) => !Object.is(dep, prevDependencies[i]))

    if (hasChanged) {
        const value = factory()
        hook.value = value
        hook.dependencies = dependencies ? [...dependencies] : null
        return value
    }

    return hook.value
}

// useCallback 实现
function useCallback(callback, dependencies) {
    return useMemo(() => callback, dependencies)
}

// useRef 实现
function useRef(initialValue) {
    const currentComponent = window.getCurrentComponent()
    if (!currentComponent) {
        throw new Error("useRef must be called inside a component")
    }

    const instance = currentComponent
    const index = window.getHookIndex()
    window.setHookIndex(index + 1)

    // 初始化钩子
    if (instance.hooks[index] === undefined) {
        instance.hooks[index] = {
            current: initialValue,
        }
    }

    return instance.hooks[index]
}

function createContext(defaultValue) {
    const context = {
        value: defaultValue,
        subscribers: new Set(),
    };

    function Provider({ value, children }) {
        context.value = value;
        context.subscribers.forEach(update => update());
        return children || null;  // 👈 修复点
    }

    function useContext() {
        const currentComponent = window.getCurrentComponent();
        if (!currentComponent) {
            throw new Error("useContext must be called inside a component");
        }

        // 本地状态，保证组件能重新渲染
        const [_, setState] = window.useState(0);

        // 订阅变化
        React.useEffect(() => {
            const update = () => setState(s => s + 1); // 强制刷新
            context.subscribers.add(update);
            return () => context.subscribers.delete(update);
        }, []);

        return context.value;
    }

    return { Provider, useContext };
}


// 导出 React API
const React = {
    createElement,
    useState,
    useEffect,
    useMemo,  //performance improvement
    useCallback,  //performance improvement
    useRef,
    useReducer,
    createContext,

    Component
}

export default React

//export default {
//    createElement,
//    Component
//};

