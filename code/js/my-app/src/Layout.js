import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/favoritecolor">FavoriteColor</Link>
          </li>
          <li>
            <Link to="/car">Car</Link>
          </li>
          <li>
            <Link to="/myeffect">MyEffect</Link>
          </li>
          <li>
            <Link to="/mycontext">MyContext</Link>
          </li>
          
         
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;