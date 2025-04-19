import logo from './logo.svg';
import './App.css';
import Admin from "./pages/admin/admin";
import Login from './pages/login/login'

import {HashRouter as Router, Navigate, Route, Routes} from "react-router-dom";

import {Layout} from "antd";

function App() {
  return (
      <Router>
          <Routes> {/*只匹配其中一个*/}

              {/* Protected admin route */}
              <Route path="/*" element={
                  <Layout style={{ minHeight: '100vh' }}>
                      <Admin />
                  </Layout>
              } />



              <Route path='/login' element={<Login/>}></Route>

             {/* <Route path='/' element={<Admin/>}></Route>*/}
              <Route path="/" element={<Navigate to="/admin" replace />} />

          </Routes>
      </Router>
  );
}

export default App;
