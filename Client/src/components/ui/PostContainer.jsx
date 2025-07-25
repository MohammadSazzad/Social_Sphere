import TitleProfile from "../../assets/TitleProfile.svg";
import { EllipsisVertical, ThumbsUp, MessageCircleMore, Send, Share, Link , Smile, SendHorizontal, Edit3, Trash2, Flag, Copy} from 'lucide-react';
import styles from './PostContainer.module.css';
import { useContext, useEffect } from "react";
import Context from "../../store/Context";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PostContainer = () => {

    const { authUser } = useAuthStore();
    const { posts, setPosts, formatTimeDifference } = useContext(Context);
    const [ openDropdown, setOpenDropdown ] = useState(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside - optimized to prevent interference
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                const isDropdownClick = event.target.closest('.dropdown-menu') || 
                                      event.target.closest('[data-dropdown-toggle]');
                
                if (!isDropdownClick && openDropdown !== null) {
                    setOpenDropdown(null);
                }
            });
        };

        if (openDropdown !== null) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openDropdown]);

    const handleDeletePost = async (postId) => {
        setOpenDropdown(null);
        
        
        setTimeout(async () => {
            const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
            
            if (!confirmDelete) {
                return;
            }

            // Show loading toast
            const loadingToast = toast.loading('Deleting post...');

            try {
                const response = await axiosInstance.delete(`/posts/delete/${postId}/${authUser.id}`);
                
                if (response.status === 200 || response.status === 204) {
                    setPosts(prevPosts => {
                        const updatedPosts = prevPosts.filter(post => post.postId !== postId);
                        return updatedPosts;
                    });
                    
                    // Dismiss loading and show success
                    toast.dismiss(loadingToast);
                    toast.success('Post deleted successfully');
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
                
            } catch (error) {
                console.error('Error deleting post:', error);
                console.error('Error response:', error.response?.data);
                toast.dismiss(loadingToast);
                toast.error(`Failed to delete post: ${error.response?.data?.message || error.message}`);
            }
        }, 10);
    }

    const handleEditPost = async(postId) => {
        console.log("Edit post clicked for postId:", postId);
        setOpenDropdown(null);
        navigate(`/post/edit/${postId}`);
    }

    const toggleDropdown = (postId) => {
        setOpenDropdown(openDropdown === postId ? null : postId);
    }

    const handleCopyLink = (postId) => {
        setOpenDropdown(null);
        const postLink = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postLink);
        toast.success('Post link copied to clipboard!');
    }

    const handleReportPost = () => {
        setOpenDropdown(null);
        toast.success('Report functionality coming soon!');
    }



    return (
        <div className={styles.postContainerWrapper}>
            {posts.map( (post) => (
                <div key={post.id} className={`card border-0 shadow ${styles.postCard}`}>
                    <div className={styles.postHeader}>
                        <div className={`d-flex justify-content-between align-items-start ${styles.postHeaderContent}`}>
                            <div className={`d-flex gap-2 ${styles.authorInfo}`}>
                                <img 
                                    src={post.profilePicture || TitleProfile} 
                                    alt="profile" 
                                    className={`rounded-circle ${styles.profileImage}`}
                                />
                                <div className={`d-flex flex-column ${styles.authorDetails}`}>
                                    <h6 className={`mb-0 ${styles.authorName}`}>{post.firstName + " " + post.lastName}</h6>
                                    <small className={styles.postTime}>{formatTimeDifference(post.createdAt)}</small>
                                </div>
                            </div>
                            <div className="position-relative">
                                <div 
                                    type="button" 
                                    className={ styles.postOptions } 
                                    onClick={ () => toggleDropdown(post.postId) }
                                    data-dropdown-toggle="true"
                                >
                                    <EllipsisVertical size={20}/>
                                </div>
                                
                                {openDropdown === post.postId && (
                                    <div className={`dropdown-menu dropdown-menu-end show ${styles.customDropdown}`} style={{ position: "absolute", right: 0, top: "100%", zIndex: 1000 }}>
                                        {/* Show Edit and Delete only for the post owner */}
                                        {post.userId === authUser.id && (
                                            <>
                                                <div 
                                                    className="dropdown-item d-flex align-items-center gap-2" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditPost(post.postId);
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <Edit3 size={16} className="text-primary" />
                                                    <span>Edit Post</span>
                                                </div>
                                                <div 
                                                    className="dropdown-item d-flex align-items-center gap-2" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePost(post.postId);
                                                    }} 
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <Trash2 size={16} className="text-danger" />
                                                    <span>Delete Post</span>
                                                </div>
                                                <div className="dropdown-divider"></div>
                                            </>
                                        )}
                                        
                                        {/* Universal options for all users */}
                                        <div 
                                            className="dropdown-item d-flex align-items-center gap-2" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyLink(post.postId);
                                            }} 
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Copy size={16} className="text-info" />
                                            <span>Copy Link</span>
                                        </div>
                                        
                                        {post.userId !== authUser.id && (
                                            <div 
                                                className="dropdown-item d-flex align-items-center gap-2" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReportPost();
                                                }} 
                                                style={{ cursor: "pointer" }}
                                            >
                                                <Flag size={16} className="text-warning" />
                                                <span>Report Post</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`card-body ${styles.postBody}`}>
                        <p className={`card-text ${styles.postContent}`}>
                            {post.content}
                        </p>
                        {post.mediaUrl && (
                            <div className={styles.postImageContainer}>
                                <img src={post.mediaUrl} alt="post" className={`img-fluid ${styles.PostImage}`} />
                            </div>
                        )}
                    </div>
                    
                   
                    <div className={`d-flex justify-content-between ${styles.postStats}`}>
                        <div className={styles.reactCount}>
                            {post.reactionCount} reacts
                        </div>
                        <div className={`d-flex gap-3 ${styles.interactionCounts}`}>
                            <div>{post.commentCount} comments</div>
                            <div>2 shares</div>
                        </div>
                    </div>
                    
                    <hr className={styles.divider} />
                    
                   
                    <div className={`d-flex justify-content-around ${styles.actionButtons}`}>
                        <button className={`d-flex gap-2 align-items-center ${styles.actionButton}`}>
                            <ThumbsUp size={20} />
                            <span className={styles.actionText}>Like</span>
                        </button>
                        <button className={`d-flex gap-2 align-items-center ${styles.actionButton}`}>
                            <MessageCircleMore size={20}/>
                            <span className={styles.actionText}>Comment</span>
                        </button>
                        <button className={`d-flex gap-2 align-items-center ${styles.actionButton}`}>
                            <Send size={20}/>
                            <span className={styles.actionText}>Send</span>
                        </button>
                        <button className={`d-flex gap-2 align-items-center ${styles.actionButton}`}>
                            <Share size={20}/>
                            <span className={styles.actionText}>Share</span>
                        </button>
                    </div>
                    
                    <hr className={styles.divider} />
                    
                    
                    <div className={`d-flex justify-content-between align-items-center ${styles.commentSectionWrapper}`}>
                        <div className={`d-flex align-items-center gap-2 ${styles.commentInputSection}`}>
                            <img 
                                src={authUser?.image || TitleProfile} 
                                alt="profile" 
                                className={styles.commentProfileImage}
                            />
                            <input 
                                type="text" 
                                className={`${styles.commentSection} form-control`} 
                                placeholder="Write a comment..." 
                            />
                        </div>
                        <div className={`d-flex gap-2 ${styles.commentActions}`}>
                            <button className={`btn btn-outline-secondary ${styles.commentActionBtn}`}>
                                <Link size={15} /> 
                            </button>
                            <button className={`btn btn-outline-secondary ${styles.commentActionBtn}`}>
                                <Smile size={15}/>
                            </button>
                            <button className={`btn btn-outline-secondary ${styles.commentActionBtn}`}>
                                <SendHorizontal size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostContainer;