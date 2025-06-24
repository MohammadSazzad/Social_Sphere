import { useRef, useState } from "react";
import styles from './signUp.module.css';
import axios from 'axios';
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
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-md-6 col-lg-5">
                    <h1 className={` ${styles.titleStyling}d-block text-center mb-3`}>Social Sphere</h1>
                        <div className="card shadow-2-strong card-registration" style={{ borderRadius: "15px" }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center">
                                    <h3 className="pb-md-0 mb-md-1">Create a new account</h3>
                                    <p>It's easy and quick.</p>
                                </div>
                                <form onSubmit={handleSubmitButton} >
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <input type="text" ref={fName} id="firstName" className="form-control form-control-lg" placeholder="First Name" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <input type="text" ref={lName} id="lastName" className="form-control form-control-lg" placeholder="Last Name" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <label htmlFor="birthdayDate" className="form-label">Date of Birth</label>
                                            <input type="date" ref={dob} className="form-control form-control-lg" id="birthdayDate" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <h6 className="mb-2 pb-1">Gender:</h6>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="gender" id="femaleGender"
                                                            value="Female" checked={gender === "Female"} onChange={(e) => setGender(e.target.value)} />
                                                        <label className="form-check-label" htmlFor="femaleGender">Female</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="gender" id="maleGender"
                                                            value="Male" checked={gender === "Male"} onChange={(e) => setGender(e.target.value)} />
                                                        <label className="form-check-label" htmlFor="maleGender">Male</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="gender" id="otherGender"
                                                            value="Other" checked={gender === "Other"} onChange={(e) => setGender(e.target.value)} />
                                                        <label className="form-check-label" htmlFor="otherGender">Other</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 mb-4 pb-2">
                                            <input type="email" ref={email} id="emailAddress" className="form-control form-control-lg" placeholder="Email address" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 mb-4 pb-2">
                                            <input type="password" ref={pass} id="password" className="form-control form-control-lg" placeholder="New password" />
                                        </div>
                                    </div>

                                    <div className="form-check d-flex justify-content-center mb-4">
                                        <input className="form-check-input me-2" type="checkbox" id="termsCheckbox" />
                                        <label className="form-check-label" htmlFor="termsCheckbox">
                                            I agree to all statements in <a href="#!">Terms of service</a>
                                        </label>
                                    </div>

                                    <div className='d-flex justify-content-center '>
                                        <button type='submit' className={`${styles.Buttn} btn btn-success btn-block btn-lg text-body`}>Sign Up</button>
                                    </div>
                                    <a href="" className="text-decoration-none d-block text-center mt-3 pt-0">Already have an account?</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;