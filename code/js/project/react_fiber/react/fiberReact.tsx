// react/fiberReact.tsx
// This is the main entry point for our custom React-like library, providing the public API.

"use client"

import type { Element, ReactNode } from "./types" // Import our custom types
import { createTextElement } from "./utils"
import { useState as _useState, useEffect as _useEffect } from "./hooks"
import { render as _render } from "./schedule" // Import the render function from scheduler

// Define the base Component class for our custom React
export class Component {
    props: any
    state: any
    updater: any // To be set by the renderer to trigger updates

    // A marker to identify class components, similar to React's internal check
    //isReactComponent = true // Changed from {} to true for clearer truthiness

    isReactComponent = {} // Revert to empty object as React does
    constructor(props: any) {
        this.props = props
        this.state = {} // Initialize state
    }

    setState(updater: any) {
        // This will be overridden by the renderer to trigger Fiber updates
        if (this.updater) {
            this.updater(updater)
        } else {
            console.warn(
                "setState called on a component without an updater. This might happen before the component is mounted.",
            )
            // Fallback for immediate state update if no updater is set (e.g., in constructor)
            const newState = typeof updater === "function" ? updater(this.state) : updater
            this.state = { ...this.state, ...newState }
        }
    }

    // Placeholder for lifecycle methods (not implemented yet)
    componentDidMount() {}
    componentDidUpdate(prevProps: any, prevState: any) {}
    componentWillUnmount() {}

    render(): Element | string | null {
        throw new Error("render method must be implemented by subclass")
    }
}

// Internal helper for creating elements, handling children flattening.
function _createElementInternal(
    type: string | Function,
    props: Record<string, any>,
    children: (Element | string | (Element | string)[])[],
): Element {
    const flattenedChildren: (Element | string)[] = []
    for (const child of children) {
        if (Array.isArray(child)) {
            for (const subChild of child) {
                flattenedChildren.push(
                    typeof subChild === "object" && subChild !== null ? subChild : createTextElement(String(subChild)),
                )
            }
        } else {
            flattenedChildren.push(typeof child === "object" && child !== null ? child : createTextElement(String(child)))
        }
    }

    return {
        type,
        props: {
            ...props,
            children: flattenedChildren, // Children are flattened here manually
        },
    }
}

// JSX runtime functions (these are what the TypeScript JSX transform calls).
// These exports make our custom renderer compatible with JSX syntax.
export function jsx(type: string | Function, props: Record<string, any>, key?: string): Element {
    // The `jsx` transform passes children directly in props.children
    return _createElementInternal(type, props, props.children ? [props.children] : [])
}

export function jsxs(type: string | Function, props: Record<string, any>, key?: string): Element {
    // The `jsxs` transform also passes children directly in props.children
    return _createElementInternal(type, props, props.children ? [props.children] : [])
}

// A simple Fragment component for <>...</> syntax, passing through its children.
export const Fragment = (props: { children?: ReactNode }) => props.children

// Export a simplified React object, exposing our custom hooks and element creation.
export const MyReact = {
    createElement: _createElementInternal, // Keep for direct calls if needed
    render: _render,
    useState: _useState,
    useEffect: _useEffect,
    Component: Component, // Export our base Component class
}

// Export a simplified ReactDOM object, primarily for the render function.
export const MyReactDOM = {
    render: MyReact.render,
}
