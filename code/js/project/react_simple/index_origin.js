import React from './react/OriginReact';




//const ele=(<div><div><h1></h1></div></div>)

//<div className='box><h1>Hello</h1><p>World</p></div>
const ele=React.createElement(
    'div',
    { className: 'box' },
    React.createElement('h1', null, 'Hello'),
    React.createElement('p', null, 'World')
);

// 渲染到DOM
React.render(ele, document.getElementById('root'));
console.log(ele);