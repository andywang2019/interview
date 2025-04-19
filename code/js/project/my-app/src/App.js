import logo from './logo.svg';
import './App.css';
import { useState,useEffect,Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Home from "./Home.js"
 import Blog from "./Blog.js"
 import FavoriteColor  from "./FavoriteColor.js"
 import Car from "./Car.js"
 import Layout from "./Layout.js"
import MyEffect from './MyEffect.js';
import MyContext from './MyContext.js';
class App extends Component {


  render() {
    return (
     
        <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="favoritecolor" element={<FavoriteColor />} />
        <Route path="car" element={<Car />} />
        <Route path="myeffect" element={<MyEffect />} />
        <Route path="mycontext" element={<MyContext />} />
        
      </Route>
    </Routes>
  </BrowserRouter>
    
    );
  }
}
  





export default App;