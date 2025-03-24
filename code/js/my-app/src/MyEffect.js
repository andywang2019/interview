import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function MyEffect() {
  const [count, setCount] = useState(0);
  const [calculation, setCalculation] = useState(0);
  useEffect(() => {
    let timer = setTimeout(() => {
    setCount((count) => count + 1);
    console.log(count);
  }, 1000);

  //return () => clearTimeout(timer)
  //setCalculation(() => count * 2);
  }, [count])
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </>
  );
}
export default MyEffect;