import {Component} from "react";
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {Footer} from "antd/es/modal/shared";

import {Routes,Route} from "react-router-dom";

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Register from "../register/register";

export default class Admin extends Component {
render() {
    return (<div>

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
                        <Route path='/register' element={<Register/>}/>
                        <Route path='/category' element={<Category/>}/>
                        <Route path='/product/*' element={<Product/>}/>
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
           {/*     <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>*/}
            </Layout>
        </Layout>
    </div>)
}
}