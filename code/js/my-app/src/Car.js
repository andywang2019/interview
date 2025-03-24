import { useState } from "react";

function MissedGoal() {
  return <h1>MISSED!</h1>;
}

function MadeGoal() {
  return <h1>Goal!</h1>;
}
function Goal(props) {
  const isGoal = props.isGoal;
  if (isGoal) {
      return <MadeGoal/>;
  }
  return <MissedGoal/>;
}

function MyCar(props) {
  return <li>I am a { props.brand }</li>;
}

function Garage() {
  const cars = ['Ford', 'BMW', 'Audi'];
  return (
      <>
          <h1>Who lives in my garage?</h1>
          <ul>
              {cars.map((car) => <MyCar brand={car} />)}
          </ul>
      </>
  );
}

/*    
function App() {
  const [color, setColor] = useState("red");
  const [count, setCount] = useState(0);
   // useEffect Hook to replicate componentDidMount and componentDidUpdate
useEffect(() => {
  // This code block runs after every render
  console.log("Component did mount or update");

  return () => {
    console.log("Component will unmount");
  };
});

return (
    <div>
            <Garage/>
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
);
}
 */



function Car() {
  const [color, setColor] = useState("red");
  const [car, setCar] = useState({
    brand: "Ford",
    model: "Mustang",
    year: "1964",
    color: "red"
  });

  const updateColor = () => {
    setCar(previousState => {
      return { ...previousState, color: color}
    });
  }

  return (
    <>
      <h1>My {car.brand}</h1>
      <p>
        It is a {car.color} {car.model} from {car.year}.
      </p>
      <button
        type="button"
        onClick={()=>{setColor(color=>color='blue')}}
      >Blue</button>
    </>
  )
}

export default Car;