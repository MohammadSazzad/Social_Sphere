export const Footer = () => {
    return (
        <section>
            <footer className="text-center text-md-start bg-light border-top">
                <div className="container p-4">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2 justify-content-center justify-content-md-start">
                                <p className="mb-0 small text-muted d-none d-md-block">
                                    English  Español  Français(France)  中文(简体)  العربية  Português(Brasil)  Italiano 
                                </p>
                                <p className="mb-0 small text-muted d-md-none">
                                    English  Español  Français  中文  العربية
                                </p>
                                <button className="btn btn-outline-secondary btn-sm">+</button>
                            </div>
                        </div>
                        
                        <hr className="mb-4" />
                        
                        <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                            <p className="text-muted">
                                Social Sphere is where conversations spark, friendships grow, and ideas take flight. Join a vibrant community where you can share your thoughts, discover new interests, and connect with like-minded people from around the world!
                            </p>
                        </div>
                    
                        <div className="col-lg-6 col-md-12">
                            <div className="d-flex flex-wrap gap-2 gap-md-3 justify-content-center justify-content-lg-start">
                                <a href="#!" className="text-body text-decoration-none small">SignUp</a>
                                <a href="#!" className="text-body text-decoration-none small">Login</a>
                                <a href="#!" className="text-body text-decoration-none small">About</a>
                                <a href="#!" className="text-body text-decoration-none small">Contact</a>
                                <a href="#!" className="text-body text-decoration-none small">Help</a>
                                <a href="#!" className="text-body text-decoration-none small">FAQ</a>
                                <a href="#!" className="text-body text-decoration-none small">Terms</a>
                                <a href="#!" className="text-body text-decoration-none small">Privacy</a>
                                <a href="#!" className="text-body text-decoration-none small">Careers</a>
                                <a href="#!" className="text-body text-decoration-none small">Blog</a>
                                <a href="#!" className="text-body text-decoration-none small">Support</a>
                                <a href="#!" className="text-body text-decoration-none small">Community</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center text-md-start mt-4 pt-3 border-top">
                        <small className="text-muted">Social Sphere © 2025</small>
                    </div>
                </div>
            </footer>
        </section>
    );
}

export default Footer;
