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

// 主应用组件
const App = () => (
    <div>
        <Welcome name="Alice" />
        <Counter />
    </div>
);


// 渲染到DOM
ReactDOM.render(<App/>, document.getElementById('root'));
//console.log(ele);