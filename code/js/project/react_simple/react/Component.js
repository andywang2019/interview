import ReactDOM from './ReactDOM';

//class component
export class Component {
    constructor(props) {
        this.props = props;
        this.state = {};
        this._currentDOM = null;
        this._currentElement = null;
    }

    setState(partialState) {
        // 合并状态
        this.state = { ...this.state, ...partialState };

        // 找到父容器
        const parentDOM = this._currentDOM.parentNode;

        // 重新渲染
        const newRenderedElement = this.render();
        newRenderedElement._instance = this;

        // 先移除旧DOM
        parentDOM.removeChild(this._currentDOM);

        // 渲染新DOM
        ReactDOM.render(newRenderedElement, parentDOM);
    }
}

// 标记类组件
Component.prototype.isReactComponent = {};