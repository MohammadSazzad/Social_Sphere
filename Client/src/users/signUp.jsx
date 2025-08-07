import { useRef, useState } from "react";
import styles from './signUp.module.css';
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";


const SignUp = () => {
    const fName = useRef();
    const lName = useRef();
    const dob = useRef();
    const email = useRef();
    const pass = useRef();
    const [gender, setGender] = useState("");
    console.log(gender);

    const navigate = useNavigate();

    const handleSubmitButton = async(e) => {
        e.preventDefault();
        try{
            const response = await axiosInstance.post('/users/signup', {
                first_name: fName.current.value,
                last_name: lName.current.value,
                date_of_birth: dob.current.value,
                gender : gender,
                email: email.current.value,
                password: pass.current.value
            });
            console.log(response);
            navigate('/users/verification');
            if(response.status === 201){
                alert('Verification Email Send Successfully.');
            }

        }catch(err){
            console.error(err);
        }
        e.target.reset();
    }

    return (
        <div className={styles.signUpContainer}>
            <div className={styles.signUpWrapper}>
                <div className={styles.headerSection}>
                    <h1 className={styles.titleStyling}>Social Sphere</h1>
                    <h3 className={styles.subtitle}>Create a new account</h3>
                    <p className={styles.description}>It&apos;s quick and easy.</p>
                </div>
                
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmitButton}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                    <input 
                                        type="text" 
                                        ref={fName} 
                                        id="firstName" 
                                        className={styles.inputField}
                                        placeholder="First Name" 
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                    <input 
                                        type="text" 
                                        ref={lName} 
                                        id="lastName" 
                                        className={styles.inputField}
                                        placeholder="Last Name" 
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="birthdayDate" className={styles.label}>Date of Birth</label>
                            <input 
                                type="date" 
                                ref={dob} 
                                className={styles.inputField}
                                id="birthdayDate" 
                                required
                            />
                        </div>

                        <div className={styles.genderSection}>
                            <h6 className={styles.genderTitle}>Gender</h6>
                            <div className={styles.genderOptions}>
                                <div className={styles.genderOption}>
                                    <div className={`${styles.radioContainer} ${gender === "Female" ? styles.selected : ""}`}>
                                        <input 
                                            className={styles.radioInput}
                                            type="radio" 
                                            name="gender" 
                                            id="femaleGender"
                                            value="Female" 
                                            checked={gender === "Female"} 
                                            onChange={(e) => setGender(e.target.value)} 
                                        />
                                        <label className={styles.radioLabel} htmlFor="femaleGender">Female</label>
                                    </div>
                                </div>
                                <div className={styles.genderOption}>
                                    <div className={`${styles.radioContainer} ${gender === "Male" ? styles.selected : ""}`}>
                                        <input 
                                            className={styles.radioInput}
                                            type="radio" 
                                            name="gender" 
                                            id="maleGender"
                                            value="Male" 
                                            checked={gender === "Male"} 
                                            onChange={(e) => setGender(e.target.value)} 
                                        />
                                        <label className={styles.radioLabel} htmlFor="maleGender">Male</label>
                                    </div>
                                </div>
                                <div className={styles.genderOption}>
                                    <div className={`${styles.radioContainer} ${gender === "Other" ? styles.selected : ""}`}>
                                        <input 
                                            className={styles.radioInput}
                                            type="radio" 
                                            name="gender" 
                                            id="otherGender"
                                            value="Other" 
                                            checked={gender === "Other"} 
                                            onChange={(e) => setGender(e.target.value)} 
                                        />
                                        <label className={styles.radioLabel} htmlFor="otherGender">Other</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="email" 
                                ref={email} 
                                id="emailAddress" 
                                className={styles.inputField}
                                placeholder="Email address" 
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="password" 
                                ref={pass} 
                                id="password" 
                                className={styles.inputField}
                                placeholder="New password" 
                                required
                            />
                        </div>

                        <div className={styles.checkboxContainer}>
                            <input 
                                className={styles.checkbox}
                                type="checkbox" 
                                id="termsCheckbox" 
                                required
                            />
                            <label className={styles.checkboxLabel} htmlFor="termsCheckbox">
                                I agree to all statements in <a href="#!" className={styles.termsLink}>Terms of service</a>
                            </label>
                        </div>

                        <button type='submit' className={styles.Buttn}>
                            Create Account
                        </button>
                        
                        <a href="/users/login" className={styles.loginLink}>
                            Already have an account? Sign in
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;