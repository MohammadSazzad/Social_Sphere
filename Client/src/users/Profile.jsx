import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.css";
import { FaEdit, FaCamera, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaHome, FaPhone, FaBirthdayCake, FaHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail, BiShare } from "react-icons/bi";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import TitleProfile from "../assets/TitleProfile.svg";
import { useContext } from "react";
import Context from "../store/Context";
import { ThumbsUp, MessageCircleMore, Send, Share, Copy, Flag, Edit3, Trash2, EllipsisVertical, Link, Smile, SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser } = useAuthStore();
  const { formatTimeDifference } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [about, setAbout] = useState({
    work: "Loading...",
    school: "Loading...",
    college: "Loading...",
    university: "Loading...",
    currentCity: "Loading...",
    hometown: "Loading...",
    phone: "Loading...",
    birthdate: "Loading...",
    relationship: "Loading...",
  });

  const [activeTab, setActiveTab] = useState("posts");
  const [newPost, setNewPost] = useState("");
  const [editingAbout, setEditingAbout] = useState(false);
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
        console.log("Delete post called with ID:", postId); // Debug log
        setOpenDropdown(null);
        
        
        setTimeout(async () => {
            const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
            
            if (!confirmDelete) {
                return;
            }

            // Show loading toast
            const loadingToast = toast.loading('Deleting post...');

            try {
                console.log("Attempting to delete post with ID:", postId); // Debug log
                const response = await axiosInstance.delete(`/posts/delete/${postId}/${authUser.id}`);
                
                if (response.status === 200 || response.status === 204) {
                    setPosts(prevPosts => {
                        const updatedPosts = prevPosts.filter(post => (post.postId || post.id) !== postId);
                        return updatedPosts;
                    });
                    
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
        console.log("Post ID type:", typeof postId); // Debug log
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


  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const res = await axiosInstance.get(`/users/post/${authUser.id}`);
        if (res.data && res.data.posts) {
          setPosts(res.data.posts);
        } else if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setPosts([]); 
      }
    };

    fetchUserPost();
  }, [authUser.id]);

  return (
    <div className={styles.profilePage}>
      <div className={styles.coverWrapper}>
        <div className={styles.coverImg}></div>
        <button className={styles.changeCover}><FaCamera /> Change Cover</button>
        <div className={styles.profileInfo}>
          <div className={styles.profileImg} style={{ height: "130px", width: "130px" , borderRadius: "50%" }}> 
            <img src={authUser.image || "/default-profile.png"} alt="Profile" className={styles.profileImg__img} />
          </div>
          <div className={styles.profileDetails}>
            <h1>{authUser.first_name} {authUser.last_name}</h1>
          </div>
        </div>
      </div>

      <div className={styles.tabNav}>
        {['posts', 'photos', 'videos', 'about'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'posts' && (
          <>
            <div className={styles.createPost}>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button onClick={() => setPosts([{ id: Date.now(), content: newPost, likes: 0, liked: false, comments: [] }, ...posts])}>Post</button>
            </div>
            <div className={styles.postContainerWrapper}>
            {console.log("Posts state:", posts)} {/* Debug log */}
            {posts.length === 0 ? (
              <div className="text-center p-4">
                <p>No posts found. Create your first post!</p>
              </div>
            ) : (
              posts.map( (post) => (
                <div key={post.postid} className={`card border-0 shadow ${styles.postCard}`}>
                    <div className={styles.postHeader}>
                        <div className={`d-flex justify-content-between align-items-start ${styles.postHeaderContent}`}>
                            <div className={`d-flex gap-2 ${styles.authorInfo}`}>
                                <img 
                                    src={authUser.image || TitleProfile} 
                                    alt="profile" 
                                    className={`rounded-circle ${styles.profileImage}`}
                                />
                                <div className={`d-flex flex-column ${styles.authorDetails}`}>
                                    <h6 className={`mb-0 ${styles.authorName}`}>
                                        {authUser.first_name + " " + authUser.last_name}
                                    </h6>
                                    <small className={styles.postTime}>
                                        {post.created_at ? formatTimeDifference(post.created_at) : 'Just now'}
                                    </small>
                                </div>
                            </div>
                            <div className="position-relative">
                                <div 
                                    type="button" 
                                    className={ styles.postOptions } 
                                    onClick={ () => toggleDropdown(post.postid) }
                                    data-dropdown-toggle="true"
                                >
                                    <EllipsisVertical size={20}/>
                                </div>
                                
                                {openDropdown === (post.postid ) && (
                                    <div className={`dropdown-menu dropdown-menu-end show ${styles.customDropdown}`} style={{ position: "absolute", right: 0, top: "100%", zIndex: 1000 }}>
                                          <div 
                                              className="dropdown-item d-flex align-items-center gap-2" 
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditPost(post.postid);
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
                                                  handleDeletePost(post.postid);
                                              }} 
                                              style={{ cursor: "pointer" }}
                                          >
                                              <Trash2 size={16} className="text-danger" />
                                              <span>Delete Post</span>
                                          </div>
                                          <div className="dropdown-divider"></div>
                                          <div 
                                              className="dropdown-item d-flex align-items-center gap-2" 
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleCopyLink(post.postid);
                                              }} 
                                              style={{ cursor: "pointer" }}
                                          >
                                              <Copy size={16} className="text-info" />
                                              <span>Copy Link</span>
                                          </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`card-body ${styles.postBody}`}>
                        <p className={`card-text ${styles.postContent}`}>
                            {post.content}
                        </p>
                        {post.url && (
                            <div className={styles.postImageContainer}>
                                <img src={post.url} alt="post" className={`img-fluid ${styles.PostImage}`} />
                            </div>
                        )}
                    </div>
                    
                   
                    <div className={`d-flex justify-content-between ${styles.postStats}`}>
                        <div className={styles.reactCount}>
                            {post.reactionCount || 0} reacts
                        </div>
                        <div className={`d-flex gap-3 ${styles.interactionCounts}`}>
                            <div>{post.commentCount || 0} comments</div>
                            <div>0 shares</div>
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
              ))
            )}
        </div>
          </>
        )}

        {activeTab === 'about' && (
          <div>
            <h4>About Info</h4>
            {editingAbout ? (
              <>
                <p><FaBriefcase /> Work: <input value={about.work} onChange={(e) => setAbout({ ...about, work: e.target.value })} /></p>
                <p><FaGraduationCap /> School: <input value={about.school} onChange={(e) => setAbout({ ...about, school: e.target.value })} /></p>
                <p><FaGraduationCap /> College: <input value={about.college} onChange={(e) => setAbout({ ...about, college: e.target.value })} /></p>
                <p><FaGraduationCap /> University: <input value={about.university} onChange={(e) => setAbout({ ...about, university: e.target.value })} /></p>
                <p><FaMapMarkerAlt /> Current City: <input value={about.currentCity} onChange={(e) => setAbout({ ...about, currentCity: e.target.value })} /></p>
                <p><FaHome /> Hometown: <input value={about.hometown} onChange={(e) => setAbout({ ...about, hometown: e.target.value })} /></p>
                <p><FaPhone /> Phone: <input value={about.phone} onChange={(e) => setAbout({ ...about, phone: e.target.value })} /></p>
                <p><FaBirthdayCake /> Birthdate: <input type="date" value={about.birthdate} onChange={(e) => setAbout({ ...about, birthdate: e.target.value })} /></p>
                <p><FaHeart /> Relationship: <select value={about.relationship} onChange={(e) => setAbout({ ...about, relationship: e.target.value })}>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                </select></p>
                <button >Save</button>
              </>
            ) : (
              <>
                <p><FaBriefcase /> Work: {about.work}</p>
                <p><FaGraduationCap /> School: {about.school}</p>
                <p><FaGraduationCap /> College: {about.college}</p>
                <p><FaGraduationCap /> University: {about.university}</p>
                <p><FaMapMarkerAlt /> Current City: {about.currentCity}</p>
                <p><FaHome /> Hometown: {about.hometown}</p>
                <p><FaPhone /> Phone: {about.phone}</p>
                <p><FaBirthdayCake /> Birthdate: {about.birthdate}</p>
                <p><FaHeart /> Relationship: {about.relationship}</p>
                <button onClick={() => setEditingAbout(true)}><FaEdit /> Edit</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;