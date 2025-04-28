import logo from './logo.svg';
import './App.css';
import Admin from "./pages/admin/admin";
import {Route, Routes, BrowserRouter as Router, Navigate} from "react-router-dom";
import {Layout} from "antd";
import Login from "./pages/login/login";

function App() {
  return (
    <div className="App">
        <Router>
            <Routes> {/*只匹配其中一个*/}


                <Route path='/login' element={<Login/>}></Route>

                {/* <Route path='/' element={<Admin/>}></Route>*/}
             {/*   <Route path="/" element={<Navigate to="/admin" replace />} />*/}

                {/* Protected admin route */}
                <Route path="/*" element={
                    <Layout style={{ minHeight: '100vh' }}>
                        <Admin />
                    </Layout>
                } />



            </Routes>
        </Router>
    </div>
  );
}

export default App;
