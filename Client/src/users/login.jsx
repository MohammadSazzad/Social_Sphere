import { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import TitleLogo from "../assets/TitleLogo.png";
import { useAuthStore } from "../store/useAuthStore";
import toast, { Toaster } from 'react-hot-toast';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const Login = () => {
  const navigate = useNavigate();
  const { authUser, login, isLoggingIn, isSignedIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authUser && isSignedIn) {
      navigate("/", { replace: true });
    }
  }, [authUser, isSignedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(email.trim())) {
      const errorMsg = "Please enter a valid email address";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!password) {
      const errorMsg = "Please enter your password";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      await login({ email: email.trim().toLowerCase(), password });
      toast.success("Login successful!");
    } catch (err) {
      const errorMsg = err.message || "Login failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <section className={`${styles.mainContainer} pt-5 vh-90`}>
      <div className={`container py-5 h-90 ${styles.mobileContainer}`}>
        <img
          src={TitleLogo}
          alt="Title"
          className={`${styles.mobileLogo} d-block d-lg-none`}
        />
        <div className="d-flex justify-content-center align-items-center h-100 gap-5">
          <div className="d-none d-lg-block">
            <img src={TitleLogo} alt="Title" />
          </div>

          <div className={`col-md-6 col-lg-5 ${styles.mobileWrapper}`}>
            <div
              className={`card shadow-2-strong ${styles.mobileCard}`}
              style={{ borderRadius: "15px" }}
            >
              <div className={`card-body p-4 p-md-3 ${styles.mobileForm}`}>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-control form-control-lg ${styles.mobileInput}`}
                      placeholder="Email address"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`form-control form-control-lg ${styles.mobileInput}`}
                      placeholder="Password"
                      required
                    />
                  </div>

                  {error && <p className="text-danger text-center">{error}</p>}

                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className={`${styles.Buttn} ${styles.mobileButton} btn btn-primary btn-block btn-lg text-body`}
                    >
                      {isLoggingIn ? "Logging in..." : "Login"}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => navigate("/users/signup")}
                    >
                      Create New Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </section>
  );
};

export default Login;
