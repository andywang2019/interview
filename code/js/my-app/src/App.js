import logo from './logo.svg';
import './App.css';
import { useState,useEffect,Component } from "react";
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

function Car(props) {
    return <li>I am a { props.brand }</li>;
}

function Garage() {
    const cars = ['Ford', 'BMW', 'Audi'];
    return (
        <>
            <h1>Who lives in my garage?</h1>
            <ul>
                {cars.map((car) => <Car brand={car} />)}
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
class App extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      count: 0,
      data:null
    };
  }


  componentDidMount() {
     console.log("mounted");
    // Fetch initial data when the component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the data has changed
    if (prevState.data !== this.state.data) {
      // Data has changed, perform additional actions
      console.log('Data has been updated:', this.state.data);
    }
  }

  componentWillUnmount() {
    // Cleanup tasks before the component is unmounted
    console.log('Component will unmount');
    // For example, remove event listeners, cancel ongoing tasks, etc.
  }

  fetchData() {
    // Simulate fetching data from an API
    setTimeout(() => {
      this.setState({ data: 'Some data fetched from API' });
    }, 1000);
  }


  // Define a method to update state
   incrementCount () {
    // Use this.setState() to update state
    this.setState({ count: this.state.count + 1 });
  }
   // Custom method to handle incrementing count
   handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  }

  // Custom method to handle decrementing count
  handleDecrement = () => {
    this.setState({ count: this.state.count - 1 });
  }


  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleIncrement}>Increment</button>
        <button onClick={this.handleDecrement}>Decrement</button>
        <p>Data: {this.state.data}</p>
      </div>
    );
  }
}


export default App;
