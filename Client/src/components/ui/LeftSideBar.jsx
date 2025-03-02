import { House, CircleEllipsis, UsersRound, MessageCircle, MonitorPlay, Store, Gamepad, LayoutDashboard, Handshake, LogOut } from "lucide-react";
import TitleProfile from "../../assets/TitleProfile.svg";
import { jwtDecode } from 'jwt-decode';

const LeftSideBar = () => {

    const handleLogOut = () => {
        localStorage.removeItem('token');
        window.location.href = "/";
    }

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{
            position: "fixed", 
            top: 60,
            left: 0,
            width: "380px",
            height: "94vh", 
            overflowY: "auto", 
        }}>
            <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
                <a href="#" className="nav-link active p-3" aria-current="page">
                    <House size={18}/>
                    <span className="ms-3">Feeds</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <CircleEllipsis size={18}/>
                    <span className="ms-3">Stories</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <UsersRound size={18}/>
                    <span className="ms-3">Friends</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <MessageCircle size={18}/>
                    <span className="ms-3">Message</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <MonitorPlay size={18}/>
                    <span className="ms-3">Video</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <Store size={18}/>
                    <span className="ms-3">Marketplace</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <Gamepad size={18}/>
                    <span className="ms-3">Gaming Video</span> 
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <LayoutDashboard size={18}/>
                    <span className="ms-3">professional Dashboard</span>
                </a>
            </li>
            <li>
                <a href="#" className="nav-link link-dark p-3">
                    <Handshake size={18}/>
                    <span className="ms-3">Group</span>
                </a>
            </li>
            </ul>
            <hr />
            <div className="d-flex justify-content-between"> 
                <button className={`btn btn-light btn-block d-flex align-items-center`}>
                    <img src={decoded.image || TitleProfile} alt="Profile Image" style={{ "width": "48px", "height": "48px", "borderRadius": "50%"}} />
                    <p className="fs-5 ms-3">{decoded.first_name+ " "+decoded.last_name}</p>
                </button>
                <button className="btn btn-light btn-block " onClick={handleLogOut}>
                    <LogOut />
                </button>
            </div>
        </div>

    );
}

export default LeftSideBar;