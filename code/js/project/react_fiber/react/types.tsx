// react/types.tsx
// Defines the core types for our Didact-like Fiber implementation.

import type { Component } from "./fiberReact" // Import Component class for Fiber type

export type Element = {
    type: string | Function
    props: {
        children: (Element | string)[]
        [key: string]: any
    }
}

export type Hook = {
    state: any
    queue: any[]
}

export type Fiber = {
    type?: string | Function
    props: {
        children: (Element | string)[]
        [key: string]: any
    }
    dom?: HTMLElement | Text // Reference to the actual DOM node
    parent?: Fiber // Parent fiber in the tree
    child?: Fiber // First child fiber
    sibling?: Fiber // Next sibling fiber
    alternate?: Fiber // Reference to the old fiber (from the previous commit)
    effectTag?: "PLACEMENT" | "UPDATE" | "DELETION" // Type of DOM operation to perform
    hooks?: Hook[] // Array to store hooks for function components
    instance?: Component // Add instance for class components
}

// Our custom ReactNode definition, mirroring React's concept of what can be rendered.
export type ReactNode = Element | string | number | boolean | null | undefined | ReactNode[]
