import TitleProfile from "../../assets/TitleProfile.svg";
import { EllipsisVertical, ThumbsUp, MessageCircleMore, Send, Share, Link , Smile, SendHorizontal} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import styles from './PostContainer.module.css';

const PostContainer = () => {

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    return (
        <>
            <div className="card m-4 border-0 shadow p-3">
                <div className="">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <img src={TitleProfile} alt="profile" className="rounded-circle" style={{height:'40px', width:'40px'}}/>
                            <div className="d-flex flex-column ml-2">
                                <h6 className="mb-0">John Doe</h6>
                                <small>2 hours ago</small>
                            </div>
                        </div>
                        <div>
                            <div type="button" className={ styles.postOptions }>
                                <EllipsisVertical size={20}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto quasi velit eos, fugit sint magni officia harum voluptate unde, temporibus placeat recusandae qui necessitatibus doloribus! Consequatur unde vero nihil? Et.
                    </p>
                    <div className={styles.postImageContainer}>
                        <img src={TitleProfile} alt="post" className="img-fluid" />
                    </div>
                </div>
                <div className="d-flex justify-content-between ">
                    <div>
                        11 reacts
                    </div>
                    <div className="d-flex gap-3">
                        <div>5 comments</div>
                        <div>2 shares</div>
                    </div>
                </div>
                <hr />
                <div className="d-flex justify-content-around">
                    <div className="d-flex gap-2">
                    <ThumbsUp size={20} />
                        Like
                    </div>
                    <div className="d-flex gap-2">
                    <MessageCircleMore  size={20}/>
                        Comment
                    </div>
                    <div className="d-flex gap-2">
                    <Send size={20}/>
                        Send
                    </div>
                    <div className="d-flex gap-2">
                    <Share size={20}/>
                        Share
                    </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between p-1">
                    <div className="d-flex gap-2">
                        <img src={decoded.image || TitleProfile} alt="profile" className="rounded-circle" style={{height:'32px', width:'32px'}}/>
                        <input type="text" className={`${styles.commentSection} form-control w-100 p-2 fs-5`} placeholder="Write a comment..." />
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn block rounded-circle border-1 border-black"><Link size={20} /> </button>
                        <button className="btn btn block rounded-circle border-1 border-black"><Smile size={20}/></button>
                        <button className="btn btn block rounded-circle border-1 border-black"><SendHorizontal size={20} /></button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostContainer;