import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, MessageCircle, Search, ChevronDown, Grip, House, MonitorPlay, Store,  UsersRound, Gamepad } from "lucide-react";
import Logo from "../assets/Logo2.png";
import TitleProfile from "../assets/TitleProfile.svg";
import styles from "./Header.module.css";
import { jwtDecode } from "jwt-decode";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;
    let image = null;
    if(decoded.image === null){
        image = TitleProfile;
    }else{
        image = decoded.image;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top d-flex justify-content-between">
            <div className="container-fluid d-flex justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <img src={Logo} alt="Logo" style={{ 'height': '40px', 'width': '40px', 'borderRadius' : '50%'}} />
                    <form className="d-none d-md-flex">
                        <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="Search Social Sphere"
                        />
                        </div>
                    </form>
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
                            src={image}
                            alt="User"
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                        />
                        <ChevronDown size={20} />
                        </button>

                        {isOpen && (
                            <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute" }}>
                                <li><a className="dropdown-item" href="#">Profile</a></li>
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
}

export default Header;