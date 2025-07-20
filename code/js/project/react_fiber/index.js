// app/page.tsx
// This file demonstrates how to use our custom MyReact and MyReactDOM with JSX.
"use client" // This component needs to be a Client Component to interact with the DOM

// Import MyReact and MyReactDOM.
// When using JSX, the TypeScript compiler will automatically look for `jsx`, `jsxs`, and `Fragment`
// exports from the module specified by `jsxImportSource` (or `react/jsx-runtime` by default).
// By exporting these from `my-react.tsx`, we make our custom renderer the JSX runtime.
//import { MyReact, MyReactDOM } from "./react/my-react"


//import {MyReact, MyReactDOM } from "./react/fiberReact.tsx"
import {Didact } from "./react/didact"

//import { useEffect } from "react" // Import React's useEffect for the root component



// Render the App component into the root element
export default function HomePage() {
    // We use React's useEffect here because HomePage is rendered by Next.js/React,
    // not by our custom MyReact renderer.
    useEffect(() => {
        const rootElement = document.getElementById("root")
        if (rootElement) {
            // MyReactDOM.render expects an Element object, which is what JSX compiles to
            MyReactDOM.render(<App />, rootElement)
        }
    }, []) // Empty dependency array means it runs once after initial render

    return (
        <div id="root" className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {/* The content will be rendered into this div by our custom renderer */}
            <p className="text-lg text-gray-600">Loading ercustom React app...</p>
        </div>
    )
}


/*
// 主应用组件
const App = () => (
    <div>
        <Welcome name="Alice" />
        <Counter />
    </div>
);

*/
/* @jsx Didact.createElement */
function Counter2() {
    const [state, setState] = Didact.useState(1)
    return (
        <h1 onClick={() => setState(c => c + 1)}>
            Count: {state}
        </h1>
    )
}
const element = <Counter2 />


//const element = <App />
const container = document.getElementById("root")
Didact.render(element, container)
