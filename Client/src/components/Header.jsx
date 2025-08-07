import { useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();

    const { authUser, logout } = useAuthStore();

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

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
                                    <ul className="dropdown-menu dropdown-menu-end show" style={{ 
                                        position: "absolute", 
                                        zIndex: 1050,
                                        right: 0,
                                        left: "auto",
                                        top: "100%",
                                        minWidth: "180px",
                                        maxWidth: "220px",
                                        border: "1px solid #e9ecef",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                        backgroundColor: "#ffffff",
                                        padding: "8px 0"
                                    }}>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={handleProfileClick}
                                                style={{ 
                                                    border: 'none', 
                                                    background: 'none', 
                                                    padding: '10px 16px', 
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#1c1e21',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                👤 Profile
                                            </button>
                                        </li>
                                        <li>
                                            <a 
                                                className="dropdown-item" 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate('/settings');
                                                }}
                                                style={{
                                                    padding: '10px 16px',
                                                    fontSize: '14px',
                                                    color: '#1c1e21',
                                                    textDecoration: 'none',
                                                    display: 'block',
                                                    transition: 'background-color 0.2s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                ⚙️ Settings
                                            </a>
                                        </li>
                                        <li><hr className="dropdown-divider" style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e9ecef' }} /></li>
                                        <li>
                                            <a 
                                                className="dropdown-item" 
                                                href="/" 
                                                onClick={handleLogout}
                                                style={{
                                                    padding: '10px 16px',
                                                    fontSize: '14px',
                                                    color: '#dc3545',
                                                    textDecoration: 'none',
                                                    display: 'block',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                🚪 Logout
                                            </a>
                                        </li>
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
                                    <button 
                                        className={`btn ${styles.navButton} ${isActive('/') ? styles.navButtonActive : ''}`}
                                        onClick={() => navigate('/')}
                                        title="Home"
                                    >
                                        <House size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`btn ${styles.navButton} ${isActive('/videos') ? styles.navButtonActive : ''}`}
                                        title="Videos"
                                    >
                                        <MonitorPlay size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`btn ${styles.navButton} ${isActive('/marketplace') ? styles.navButtonActive : ''}`}
                                        title="Marketplace"
                                    >
                                        <Store size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`btn ${styles.navButton} ${isActive('/groups') ? styles.navButtonActive : ''}`}
                                        title="Groups"
                                    >
                                        <UsersRound size={24}/>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`btn ${styles.navButton} ${isActive('/gaming') ? styles.navButtonActive : ''}`}
                                        onClick={() => navigate('/gaming')}
                                        title="Gaming"
                                    >
                                        <Gamepad size={24}/>
                                    </button>
                                </li>
                            </ul>
                        </div>

            {/* Desktop Right Side Actions */}
            <div className={styles.desktopRightActions}>
                <button 
                    className={`btn btn-light ${styles.actionButton} ${isActive('/menu') ? styles.actionButtonActive : ''}`}
                    title="Menu"
                >
                    <Grip size={18}/>
                </button>
                <button 
                    className={`btn btn-light ${styles.actionButton} ${isActive('/message') ? styles.actionButtonActive : ''}`}
                    onClick={() => navigate('/message')}
                    title="Messages"
                >
                    <MessageCircle size={18} />
                </button>
                <button 
                    className={`btn btn-light ${styles.actionButton} ${isActive('/notifications') ? styles.actionButtonActive : ''}`}
                    title="Notifications"
                >
                    <Bell size={18} />
                </button>                            
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
                                    <ul className="dropdown-menu dropdown-menu-end show" style={{ 
                                        position: "absolute", 
                                        zIndex: 1050,
                                        right: 0,
                                        left: "auto",
                                        top: "100%",
                                        minWidth: "200px",
                                        maxWidth: "250px",
                                        border: "1px solid #e9ecef",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                        backgroundColor: "#ffffff",
                                        padding: "8px 0"
                                    }}>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={handleProfileClick}
                                                style={{ 
                                                    border: 'none', 
                                                    background: 'none', 
                                                    padding: '12px 16px', 
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#1c1e21',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                👤 Profile
                                            </button>
                                        </li>
                                        <li>
                                            <a 
                                                className="dropdown-item" 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                style={{
                                                    padding: '12px 16px',
                                                    fontSize: '14px',
                                                    color: '#1c1e21',
                                                    textDecoration: 'none',
                                                    display: 'block',
                                                    transition: 'background-color 0.2s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                ⚙️ Settings
                                            </a>
                                        </li>
                                        <li><hr className="dropdown-divider" style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e9ecef' }} /></li>
                                        <li>
                                            <a 
                                                className="dropdown-item" 
                                                href="/" 
                                                onClick={handleLogout}
                                                style={{
                                                    padding: '12px 16px',
                                                    fontSize: '14px',
                                                    color: '#dc3545',
                                                    textDecoration: 'none',
                                                    display: 'block',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                🚪 Logout
                                            </a>
                                        </li>
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
                    className={`${styles.mobileNavIcon} ${isActive('/') ? styles.mobileNavIconActive : ''}`}
                    onClick={() => navigate('/')}
                    title="Home"
                >
                    <House size={20}/>
                    <span>Home</span>
                </button>
                <button 
                    className={`${styles.mobileNavIcon} ${isActive('/videos') ? styles.mobileNavIconActive : ''}`}
                    title="Videos"
                >
                    <MonitorPlay size={20}/>
                    <span>Videos</span>
                </button>
                <button 
                    className={`${styles.mobileNavIcon} ${isActive('/marketplace') ? styles.mobileNavIconActive : ''}`}
                    title="Marketplace"
                >
                    <Store size={20}/>
                    <span>Market</span>
                </button>
                <button 
                    className={`${styles.mobileNavIcon} ${isActive('/groups') ? styles.mobileNavIconActive : ''}`}
                    title="Groups"
                >
                    <UsersRound size={20}/>
                    <span>Groups</span>
                </button>
                <button 
                    className={`${styles.mobileNavIcon} ${isActive('/message') ? styles.mobileNavIconActive : ''}`}
                    onClick={() => navigate('/message')}
                    title="Messages"
                >
                    <MessageCircle size={20}/>
                    <span>Messages</span>
                </button>
            </div>
        </>
    );
};

export default Header;
