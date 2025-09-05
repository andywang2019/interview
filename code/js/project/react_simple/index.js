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

function counterReducer(state, action) {
    switch (action.type) {
        case "increment":
            return state + 1
        case "decrement":
            return state - 1
        case "reset":
            return 0
        default:
            return state
    }
}
// 1. 函数组件 - useState & useEffect
function FunCounter() {
    const [count, setCount] = React.useState(0)
 //   const [message, setMessage] = React.useState("Hello!")


    const [name, setName] = React.useState("")

    const [red_count, dispatch] = React.useReducer(counterReducer, 0)  //redux

    // 用 useMemo 缓存一个昂贵的计算结果
   //let expensiveValue =1
    const expensiveValue = React.useMemo(() => {
       console.log("正在执行耗时计算 ...")
        // 模拟一个耗时计算，比如计算阶乘
        let result = 1
       for (let i = 1; i <= count * 10000000; i++) {
           result = (result * i) % 1000000007 // 取模避免溢出
        }
       return result
    }, [count])
    const handleClick = React.useCallback(() => {
        setCount(c => c + 1);
    }, []);

    //  expensiveValue=result
    React.useEffect(() => {
        console.log("useEffect Count changed:", count)
      //  setMessage(`Count is now ${count}`)
    }, [count])

    React.useEffect(() => {
        console.log(" useEffect Component mounted")
        const timer = setInterval(() => {
            console.log("useEffect Timer tick")
        }, 2000)

        return () => {
            console.log("Cleaning up timer")
            clearInterval(timer)
        }
    }, [])

    return (
        <div style={{ padding: "20px", border: "1px solid #007bff", borderRadius: "8px", margin: "10px" }}>
            <h3>Function Counter</h3>
            <p>Count: {count}</p>
            <p>Expensive Value: {expensiveValue}</p>
            {/*   <p>Message: {message}</p>*/}
            <button
                onClick={() =>{ handleClick()}}
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

            <input
                type="text"
                value={name}
                placeholder="请输入名字"
                onChange={(e) => setName(e.target.value)}
                style={{marginBottom: "10px", padding:"6px"}}
            />
            <p>Name: {name}</p>
            <div>
                <p>Count: {red_count}</p>
                <button onClick={() => dispatch({ type: "increment" })}>+1</button>
                <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
                <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
            </div>

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