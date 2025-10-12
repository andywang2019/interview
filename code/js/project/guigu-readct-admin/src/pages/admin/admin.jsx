import React, {Component} from 'react'
import {Navigate, Route, BrowserRouter as Router, Routes, Outlet} from 'react-router-dom'
import { Layout } from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
/*import Product from '../product/product'*/
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
/*import NotFound from '../not-found/not-found'*/
/*import Order from '../order/order'*/




const { Footer, Sider, Content } = Layout

/*
后台管理的路由组件
 */
export default class Admin extends Component {
    render () {
        const user = memoryUtils.user
        // 如果内存没有存储user ==> 当前没有登陆
     /*   if(!user || !user._id) {
            // 自动跳转到登陆(在render()中)
            return <Navigate to='/login'/>
}*/
        return (

            <Layout style={{minHeight: '100%'}}>
                <Sider>
                      <LeftNav/>
                </Sider>
                <Layout>
                 <Header>Header</Header>
                    <Content style={{margin: 20, backgroundColor: '#fff'}}>

                        <Routes>
                            <Route from='/' exact to='/home'/>


                            <Route path='/home' element={<Home/>}/>
                            <Route path='/category' element={<Category/>}/>
                       {/*         <Route path='/product' element={Product}/>*/}
                            <Route path='/user' element={<User/>}/>
                            <Route path='/role' element={<Role/>}/>
                            <Route path="/charts/bar" element={<Bar/>}/>
                            <Route path="/charts/pie" element={<Pie/>}/>
                            <Route path="/charts/line" element={<Line/>}/>
                            {/*   <Route path="/order" element={Order}/>
                                <Route element={NotFound}/>
*/}
                        </Routes>


                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>

        )
    }
}