import React from './react/React';
import ReactDOM from './react/ReactDOM';

// 函数组件示例
// 函数组件示例
function Welcome(props) {
    return <h1 className="title">Welcome, {props.name}</h1>;
}

// 类组件示例
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }



    handleClick = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div style={{ padding: '10px' }}>
                <p>Count: {this.state.count}</p>
                <button onClick={this.handleClick}>Increment</button>
            </div>
        );

    }
}
// 1. 函数组件 - useState & useEffect
function FunCounter() {
    const [count, setCount] = React.useState(0)
 //   const [message, setMessage] = React.useState("Hello!")

    React.useEffect(() => {
        console.log("Count changed:", count)
      //  setMessage(`Count is now ${count}`)
    }, [count])

    /*React.useEffect(() => {
        console.log("Component mounted")
        const timer = setInterval(() => {
            console.log("Timer tick")
        }, 2000)

        return () => {
            console.log("Cleaning up timer")
            clearInterval(timer)
        }
    }, [])
*/
    return (
        <div style={{ padding: "20px", border: "1px solid #007bff", borderRadius: "8px", margin: "10px" }}>
            <h3>Function Counter</h3>
            <p>Count: {count}</p>
         {/*   <p>Message: {message}</p>*/}
            <button
                onClick={() => setCount(count + 1)}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Increment
            </button>
        </div>
    )
}

// 主应用组件
const App = () => (
    <div>
{/*        <Welcome name="Alice" />
        <Counter />*/}
        <FunCounter/>
    </div>
);


// 渲染到DOM
ReactDOM.render(<App/>, document.getElementById('root'));
//console.log(ele);