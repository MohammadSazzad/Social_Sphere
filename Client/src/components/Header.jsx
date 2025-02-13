import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogoutButton = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <header>
            <button className="btn btn-primary btn-block btn-lg text-body" onClick={handleLogoutButton}>logout</button>
        </header>
    );
}

export default Header;