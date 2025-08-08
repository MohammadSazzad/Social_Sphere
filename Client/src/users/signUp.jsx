// SignUp.jsx
import { useState } from "react";
import styles from "./signUp.module.css";
import { useNavigate } from "react-router-dom";
import TitleLogo from "../assets/TitleLogo.png";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import LoaderX from "../components/Loader";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!EMAIL_REGEX.test(form.email.trim()))
      errs.email = "Please enter a valid email address";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (!form.terms) errs.terms = "You must agree to the terms";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      const { status } = await axiosInstance.post("/users/signup", {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        date_of_birth: form.dob,
        gender: form.gender,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (status === 201) {
        toast.success("Verification email sent! Check your inbox.");
        navigate("/users/verification");
      }
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.signUpWrapper}>
        <div className={styles.headerSection}>
          <img src={TitleLogo} alt="Logo" className={`${styles.titleImg} mb-3`} />
          <h3>Create a new account</h3>
          <p>It’s quick and easy.</p>
        </div>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`${styles.inputField} ${
                  errors.firstName ? styles.inputError : ""
                }`}
                placeholder="First Name"
              />
              {errors.firstName && (
                <small className={styles.errorMessage}>
                  {errors.firstName}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`${styles.inputField} ${
                  errors.lastName ? styles.inputError : ""
                }`}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <small className={styles.errorMessage}>
                  {errors.lastName}
                </small>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.dob ? styles.inputError : ""
              }`}
            />
            {errors.dob && (
              <small className={styles.errorMessage}>{errors.dob}</small>
            )}
          </div>

          <div className="mb-3">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.gender ? styles.inputError : ""
              }`}
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <small className={styles.errorMessage}>{errors.gender}</small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="Email address"
            />
            {errors.email && (
              <small className={styles.errorMessage}>{errors.email}</small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="New password (min 6 characters)"
            />
            {errors.password && (
              <small className={styles.errorMessage}>{errors.password}</small>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="form-check-input"
              id="termsCheckbox"
            />
            <label
              className="form-check-label"
              htmlFor="termsCheckbox"
            >
              I agree to the <a href="#!">Terms of Service</a>
            </label>
            {errors.terms && (
              <small className={styles.errorMessage}>{errors.terms}</small>
            )}
          </div>

          {errors.submit && (
            <div className={styles.submitErrorMessage}>{errors.submit}</div>
          )}

          <button type="submit" className={styles.Buttn} disabled={isLoading}>
            {isLoading ? <LoaderX /> : "Create Account"}
          </button>

          <p className="mt-3">
            Already have an account?{" "}
            <a href="/login">Sign in</a>
          </p>
        </form>
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
    </div>
  );
};

export default SignUp;
