import { useRef, useState } from "react";
import styles from "./login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const email = useRef();
  const pass = useRef();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/users/login", {
        email: email.current.value,
        password: pass.current.value,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-6 col-lg-5">
            <h1 className={` ${styles.titleStyling} d-block text-center mb-3`}>
              Social Sphere
            </h1>
            <div
              className="card shadow-2-strong card-registration"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="text-center">
                  <h3 className="pb-md-0 mb-md-1">Login to your account</h3>
                  <p>Enter your credentials below.</p>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="row">
                    <div className="col-md-12 mb-4 pb-2">
                      <input
                        type="email"
                        ref={email}
                        id="emailAddress"
                        className="form-control form-control-lg"
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-4 pb-2">
                      <input
                        type="password"
                        ref={pass}
                        id="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-danger text-center">{error}</p>
                  )}

                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className={`${styles.Buttn} btn btn-primary btn-block btn-lg text-body`}
                    >
                      Login
                    </button>
                  </div>

                  <a
                    href="/signup"
                    className="text-decoration-none d-block text-center mt-3 pt-0"
                  >
                    Don't have an account? Sign Up
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
