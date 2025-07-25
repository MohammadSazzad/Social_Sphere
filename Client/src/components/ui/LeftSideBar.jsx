import { House, CircleEllipsis, UsersRound, MessageCircle, MonitorPlay, Store, Gamepad, LayoutDashboard, Handshake, LogOut } from "lucide-react";
import TitleProfile from "../../assets/TitleProfile.svg";
import styles from "./LeftSideBar.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";


const LeftSideBar = () => {

    const { authUser, logout } = useAuthStore();

    const handleLogOut = () => {
        logout();
        window.location.href = "/login";
    }
    
    return (
        <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light ${styles.leftSidebar}`} style={{
            position: "fixed", 
            top: 60,
            left: 0,
            width: "380px",
            height: "94vh", 
            overflowY: "auto", 
        }}>
            <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
                <a href="/" className={` ${styles.navLink} nav-link link-dark p-3`} aria-current="page">
                    <House size={18}/>
                    <span className="ms-3">Feeds</span>
                </a>
            </li>
            <li>
                <a href="#" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <CircleEllipsis size={18}/>
                    <span className="ms-3">Stories</span>
                </a>
            </li>
            <li>
                <a href="#" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <UsersRound size={18}/>
                    <span className="ms-3">Friends</span>
                </a>
            </li>
            <li>
                <a href="/message" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <MessageCircle size={18}/>
                    <span className="ms-3">Message</span>
                </a>
            </li>
            <li>
                <a href="#" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <MonitorPlay size={18}/>
                    <span className="ms-3">Video</span>
                </a>
            </li>
            <li>
                <a href="#" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <Store size={18}/>
                    <span className="ms-3">Marketplace</span>
                </a>
            </li>
            <li>
    <Link to="/gaming" className={` ${styles.navLink} nav-link link-dark p-3`}>
        <Gamepad size={18}/>
        <span className="ms-3">Gaming</span>
    </Link>
           </li>

            <li>
                <a href="#" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <LayoutDashboard size={18}/>
                    <span className="ms-3">professional Dashboard</span>
                </a>
            </li>
            <li>
                <a href="#" className={` ${styles.navLink} nav-link link-dark p-3`}>
                    <Handshake size={18}/>
                    <span className="ms-3">Group</span>
                </a>
            </li>
            </ul>
            <hr />
            <div className="d-flex justify-content-between"> 
                <button className={`btn btn-light btn-block d-flex align-items-center`}>
                    <img src={authUser?.image || TitleProfile} alt="Profile Image" style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "objectFit": "cover"}} />
                    <p className="fs-5 ms-3">{authUser ? `${authUser.first_name} ${authUser.last_name}` : 'Guest User'}</p>
                </button>
                <button className="btn btn-light btn-block " onClick={handleLogOut}>
                    <LogOut />
                </button>
            </div>
        </div>

    );
}

export default LeftSideBar;