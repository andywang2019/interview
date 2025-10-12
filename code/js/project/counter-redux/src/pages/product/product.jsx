import React, {Component} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
/*import ProductDetail from './detail'*/

import './product.less'
import ProductDetail from "./detail";

/*
商品路由
 */
export default class Product extends Component {
  render() {
    return (
        <div>
      <Routes>
        <Route exact path='/' element={<ProductHome/>} />
        <Route path='/addupdate' element={<ProductAddUpdate/>}/>
        <Route path='/detail' element={<ProductDetail/>}/>
        <Route path="/*" element={<Navigate to="/product" replace />} />


      </Routes>
   {/*       <Routes>
            <Route path="/" element={<ProductHome />} />
            <Route path="/addupdate" element={<ProductAddUpdate />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
          </Routes>*/}
      </div>
    )
  }
}