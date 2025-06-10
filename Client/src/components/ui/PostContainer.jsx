import TitleProfile from "../../assets/TitleProfile.svg";
import { EllipsisVertical, ThumbsUp, MessageCircleMore, Send, Share, Link , Smile, SendHorizontal} from 'lucide-react';
import styles from './PostContainer.module.css';
import { useContext } from "react";
import Context from "../../store/Context";
import { useAuthStore } from "../../store/useAuthStore";

const PostContainer = () => {

    const { authUser } = useAuthStore();
    const { posts, formatTimeDifference } = useContext(Context);

    return (
        <> 
            {posts.map( (post) => (
                <div key={post.id} className="card m-4 border-0 shadow p-3">
                    <div className="">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex gap-2">
                                <img src={post.profilePicture || TitleProfile} alt="profile" className="rounded-circle" style={{height:'40px', width:'40px'}}/>
                                <div className="d-flex flex-column ml-2">
                                    <h6 className="mb-0">{post.firstName + " " + post.lastName}</h6>
                                    <small>{formatTimeDifference(post.createdAt)}</small>
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
                            {post.content}
                        </p>
                        {post.mediaUrl &&  <div className={styles.postImageContainer}>
                            <img src={ post.mediaUrl } alt="post" className={`img-fluid ${styles.PostImage}`} />
                        </div>}
                        
                    </div>
                    <div className="d-flex justify-content-between ">
                        <div>
                            {post.reactionCount} reacts
                        </div>
                        <div className="d-flex gap-3">
                            <div>{post.commentCount} comments</div>
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
                    <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center gap-1 ">
                        <img 
                            src={authUser?.image || TitleProfile} 
                            alt="profile" 
                            style={{
                                height: '32px', 
                                width: '32px', 
                                borderRadius: '50%', 
                            }}
                            />

                            <input type="text" className={`${styles.commentSection} form-control`} placeholder="Write a comment." />
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn block rounded-circle  border-black"><Link size={15} /> </button>
                            <button className="btn btn block rounded-circle  border-black"><Smile size={15}/></button>
                            <button className="btn btn block rounded-circle  border-black"><SendHorizontal size={15} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default PostContainer;