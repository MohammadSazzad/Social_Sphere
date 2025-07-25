import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, MessageCircle, ChevronDown, Grip, House, MonitorPlay, Store,  UsersRound, Gamepad, Search } from "lucide-react";
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
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
                <div className="container-fluid">
                    {/* Mobile Header - Show logo and search on left, profile on right */}
                    <div className="d-xl-none d-flex justify-content-between align-items-center w-100">
                        {/* Left side - Logo and Search */}
                        <div className="d-flex align-items-center gap-2">
                            <img 
                                src={Logo} 
                                alt="Logo" 
                                className={styles.logo}
                            />
                            <div className={styles.mobileSearchContainer}>
                                <SearchBarInHeader />
                            </div>
                        </div>
                        
                        {/* Right side - Profile only */}
                        <div className="d-flex align-items-center gap-1">
                            {/* Mobile Profile */}
                            <div className="dropdown">
                                <button
                                    className={`btn d-flex align-items-center ${styles.profileButton}`}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <img
                                        src={authUser?.image || TitleProfile}
                                        alt="User"
                                        className={`rounded-circle ${styles.profileImage}`}
                                    />
                                </button>

                                {isOpen && (
                                    <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute", zIndex: 1050 }}>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={handleProfileClick}
                                                style={{ border: 'none', background: 'none', padding: '8px 16px', cursor: 'pointer' }}
                                            >
                                                Profile
                                            </button>
                                        </li>
                                        <li><a className="dropdown-item" href="#">Settings</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="/" onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className={`d-none d-xl-flex ${styles.desktopLayout}`}>
                        <div className={styles.logoSearchContainer}>
                            <img 
                                src={Logo} 
                                alt="Logo" 
                                className={styles.logo}
                            />
                            <SearchBarInHeader />
                        </div>

                        {/* Desktop Navigation */}
                        <div className={styles.desktopNav}>
                            <ul className='navbar-nav d-flex justify-content-center'>
                                <li className="nav-item">
                                    <button className={`btn ${styles.navButton}`} onClick={() => navigate('/')}>
                                        <House size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`btn ${styles.navButton}`}>
                                        <MonitorPlay size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`btn ${styles.navButton}`}>
                                        <Store size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`btn ${styles.navButton}`}>
                                        <UsersRound size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`btn ${styles.navButton}`}>
                                        <Gamepad size={24}/>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Desktop Right Side Actions */}
                        <div className={styles.desktopRightActions}>
                            <button className={`btn btn-light ${styles.actionButton}`}>
                                <Grip size={18}/>
                            </button>
                            <button className={`btn btn-light ${styles.actionButton}`}>
                                <MessageCircle size={18} />
                            </button>
                            <button className={`btn btn-light ${styles.actionButton}`}>
                                <Bell size={18} />
                            </button>

                            {/* Desktop User Profile Dropdown */}
                            <div className="dropdown">
                                <button
                                    className={`btn d-flex align-items-center ${styles.profileButton}`}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <img
                                        src={authUser?.image || TitleProfile}
                                        alt="User"
                                        className={`rounded-circle ${styles.profileImage}`}
                                    />
                                    <ChevronDown size={16} className="ms-1" />
                                </button>

                                {isOpen && (
                                    <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute", zIndex: 1050 }}>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={handleProfileClick}
                                                style={{ border: 'none', background: 'none', padding: '8px 16px', cursor: 'pointer' }}
                                            >
                                                Profile
                                            </button>
                                        </li>
                                        <li><a className="dropdown-item" href="#">Settings</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="/" onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className={`d-xl-none ${styles.mobileBottomNav}`}>
                <button 
                    className={`${styles.mobileNavIcon}`}
                    onClick={() => navigate('/')}
                >
                    <House size={20}/>
                    <span>Home</span>
                </button>
                <button className={`${styles.mobileNavIcon}`}>
                    <MonitorPlay size={20}/>
                    <span>Videos</span>
                </button>
                <button className={`${styles.mobileNavIcon}`}>
                    <Store size={20}/>
                    <span>Market</span>
                </button>
                <button className={`${styles.mobileNavIcon}`}>
                    <UsersRound size={20}/>
                    <span>Groups</span>
                </button>
                <button className={`${styles.mobileNavIcon}`}>
                    <MessageCircle size={20}/>
                    <span>Messages</span>
                </button>
            </div>
        </>
    );
};

export default Header;
