import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const VerifyUser = () => {

    const otp = useRef();
    const navigate = useNavigate();

    const handleSubmitButton = async(e) => {
        e.preventDefault();
        try{
            const response = await axiosInstance.post('/users/verify', {
                otp : otp.current.value
            });
            console.log(response.data);
            navigate('/feed');
        }catch(err){
            console.log(err);
        }
        e.target.reset();
    }

    return (
        <section className="vh-80">
            <div className="container py-5 h-80">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-2-strong card-registration" style={{ borderRadius: "15px" }}>
                            <div className="card-body p-4 p-md-4">
                                <div className="pb-3 ">
                                    <div>
                                        <h2 className="pb-md-0 mb-md-1">Enter the confirmation code from the email.</h2>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <form onSubmit={handleSubmitButton} >
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <label htmlFor="confirmationCode" className="form-label">Let us know if this email belongs to you. Enter the code in the email sent to your mail.</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <input type="text" ref={otp} id="confirmationCode" className="form-control form-control-lg" placeholder="Confirmation Code" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <a href="" className="text-decoration-none">Send Email Again</a>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="text-end">
                                        <button className="btn btn-light btn-block btn-lg text-body me-2 ">Update </button>
                                        <button type="submit" className="btn btn-light btn-block btn-lg text-body gap-2" id="verifyButton">Continue</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </section>
    )
}

export default VerifyUser;