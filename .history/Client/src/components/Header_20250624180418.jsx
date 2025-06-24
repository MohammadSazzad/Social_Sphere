import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, MessageCircle, ChevronDown, Grip, House, MonitorPlay, Store,  UsersRound, Gamepad } from "lucide-react";
import Logo from "../assets/Logo2.png";
import TitleProfile from "../assets/TitleProfile.svg";
import styles from "./Header.module.css";
import { useAuthStore } from "../store/useAuthStore";
import SearchBarInHeader from "./ui/SearchBarInHeader";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const { authUser, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleProfileClick = () => {
        if (authUser) {
            navigate(`/profile/${authUser.id}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top d-flex justify-content-between ">
            <div className="container-fluid d-flex justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <img src={Logo} alt="Logo" style={{ 'height': '40px', 'width': '40px', 'borderRadius' : '50%'}} />
                    <SearchBarInHeader />
                </div>
                <ul className="navbar-nav mx-auto d-none d-lg-flex pe-5 ">
                    <li className="nav-item">
                        <button className={`btn pe-5 ps-5 ${styles.navButton}`}>
                            <House size={30}/>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn pe-5 ps-5 ${styles.navButton}`}>
                        <MonitorPlay size={30}/>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn pe-5 ps-5 ${styles.navButton}`}>
                        <Store size={30}/>
                        </button >
                    </li>
                    <li className="nav-item">
                        <button className={`btn pe-5 ps-5 ${styles.navButton}`}>
                            <UsersRound size={30}/>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn pe-5 ps-5 ${styles.navButton}`}>
                            <Gamepad size={30}/>
                        </button>
                    </li>
                </ul>

                <div className="d-flex align-items-center">
                    <button className="btn btn-light me-2">
                        <Grip size={20}/>
                    </button>
                    <button className="btn btn-light me-2">
                        <MessageCircle size={20} />
                    </button>
                    <button className="btn btn-light me-2">
                        <Bell size={20} />
                    </button>
                    <div className="dropdown">
                        <button
                            className="btn d-flex align-items-center"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <img
                                src={authUser?.image || TitleProfile}
                                alt="User"
                                className="rounded-circle me-2"
                                width="32"
                                height="32"
                            />
                            <ChevronDown size={20} />
                        </button>

                        {isOpen && (
                            <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute" }}>
                                <li>
                                    <button className="dropdown-item" 
                                    onClick={handleProfileClick}
                                    style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
                                    > Profile</button>
                                </li>
                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="/" onClick={handleLogout}>Logout</a></li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
