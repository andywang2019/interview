// react/utils.tsx
// Utility functions for DOM manipulation and property handling, similar to Didact.

import type { Element, Fiber } from "./types"

// Creates a text element for strings/numbers in JSX.
export function createTextElement(text: string): Element {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

// Creates a DOM node based on the fiber type.
export function createDom(fiber: Fiber): HTMLElement | Text {
    const dom =
        fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode(fiber.props.nodeValue)
            : document.createElement(fiber.type as string)

    updateDom(dom, {}, fiber.props, fiber) // Pass the fiber to updateDom
    return dom
}

// Helper functions to filter and compare properties.
export const isEvent = (key: string) => key.indexOf("on") === 0 // Checks if a prop is an event listener (e.g., "onClick")
export const isProperty = (key: string) => key !== "children" && !isEvent(key) // Checks if a prop is a standard DOM property
export const isNew = (prev: any, next: any) => (key: string) => prev[key] !== next[key] // Checks if a property has changed
export const isGone = (prev: any, next: any) => (key: string) => !(key in next) // Checks if a property has been removed

// Updates DOM properties and event listeners based on new and old props.
// Added 'fiber' parameter to check its type.
export function updateDom(dom: HTMLElement | Text, prevProps: any, nextProps: any, fiber?: Fiber) {
    // Only attempt to set/remove attributes if it's not a TEXT_ELEMENT
    const isHTMLElement = fiber ? fiber.type !== "TEXT_ELEMENT" : dom instanceof HTMLElement

    // Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
        .forEach((key) => {
            const eventType = key.toLowerCase().substring(2)
            dom.removeEventListener(eventType, prevProps[key])
        })

    // Remove old properties
    if (isHTMLElement) {
        Object.keys(prevProps)
            .filter(isProperty)
            .filter(isGone(prevProps, nextProps))
            .forEach((key) => {
                ;(dom as HTMLElement).removeAttribute(key)
            })
    }

    // Set new or changed properties
    if (isHTMLElement) {
        Object.keys(nextProps)
            .filter(isProperty)
            .filter(isNew(prevProps, nextProps))
            .forEach((key) => {
                ;(dom as HTMLElement).setAttribute(key, nextProps[key])
            })
    }

    // Add new event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((key) => {
            const eventType = key.toLowerCase().substring(2)
            const handler = nextProps[key] // Get the handler
            if (typeof handler === "function") {
                dom.addEventListener(eventType, handler)
            } else {
                console.warn(`Attempted to add non-function event listener for ${key} on`, dom, ":", handler)
            }
        })
}
