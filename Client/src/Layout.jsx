import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Layout = () => {

    const isLogin = localStorage.getItem('token');

    return (
        <>
            {isLogin && <Header />}
            <Outlet />
            {!isLogin &&  <Footer />}
        </>
    );
}

export default Layout;