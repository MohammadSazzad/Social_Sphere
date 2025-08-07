import { useRef, useState } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import TitleLogo from "../assets/TitleLogo.png";
import { useAuthStore } from "../store/useAuthStore";
import LoaderX from "../components/Loader";

const Login = () => {
  const email = useRef();
  const pass = useRef();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authUser, login } = useAuthStore();
  console.log(authUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const data = {
      email: email.current.value,
      password: pass.current.value,
    }
    login(data);
    if(!authUser) {
      LoaderX(authUser);
    }else {
      navigate("/");
    }
  };

  const handleSignUp = () => {
    navigate("/users/signup");
  }

  return (
    <section className={`${styles.mainContainer} pt-5 vh-90`}>
      <div className={`container py-5 h-90 ${styles.mobileContainer}`} >
        <img src={TitleLogo} alt="Title" className={`${styles.mobileLogo} d-block d-lg-none`} />
        
        <div className="d-flex justify-content-center align-items-center h-100 gap-5">
          <div className="d-none d-lg-block">
            <img src={TitleLogo} alt="Title" />
          </div>
          <div className={`col-md-6 col-lg-5 ${styles.mobileWrapper}`}>
            <div
              className={`card shadow-2-strong card-registration ${styles.mobileCard}`}
              style={{ borderRadius: "15px" }}
            >
              <div className={`card-body p-4 p-md-3 ${styles.mobileForm}`}>
                <form onSubmit={handleLogin}>
                  <div className="row">
                    <div className="col-md-12 mb-4 pb-2">
                      <input
                        type="email"
                        ref={email}
                        id="emailAddress"
                        className={`form-control form-control-lg ${styles.mobileInput}`}
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
                        className={`form-control form-control-lg ${styles.mobileInput}`}
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
                      className={`${styles.Buttn} ${styles.mobileButton} btn btn-primary btn-block btn-lg text-body`}
                    >
                      Login
                    </button>
                  </div>

                  <a
                    href="#!"
                    className="text-decoration-none d-block text-center mt-3 pt-0"
                  >
                    Forgotten password? Cnagne
                  </a>
                  <hr />
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className={`btn btn-primary btn-block btn-lg text-body ${styles.mobileButton}`} onClick={handleSignUp}
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
    </section>
  );
};

export default Login;