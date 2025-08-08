import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast, { Toaster } from 'react-hot-toast';
import LoaderX from "../components/Loader";

const VerifyUser = () => {
    const otp = useRef();
    const navigate = useNavigate();
    const { verify } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitButton = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await verify(otp.current.value);
            toast.success("Email verified successfully! Welcome!");
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error("Verification failed. Please check your OTP and try again.");
        } finally {
            setIsLoading(false);
        }
        e.target.reset();
    };

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
                                        <button type="submit" className="btn btn-light btn-block btn-lg text-body gap-2" id="verifyButton" disabled={isLoading}>
                                            {isLoading ? <LoaderX /> : "Continue"}
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
    )
}

export default VerifyUser;