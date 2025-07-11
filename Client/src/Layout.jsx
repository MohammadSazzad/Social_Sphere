import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const Layout = () => {
    const { isCheckingAuth, checkAuth, authUser, onlineUsers } = useAuthStore();

    

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    if(isCheckingAuth) {
        return (
            <div>
                <Loader/>
            </div>
        )
    }

    console.log(onlineUsers);
    console.log(authUser);

    return (
        <>
            {authUser && < Header />}
            <Outlet />
            {!authUser && <Footer />}
        </>
    );
}

export default Layout;