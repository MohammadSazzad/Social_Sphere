import { useParams, useNavigate } from "react-router-dom";
import styles from './EditPost.module.css';
import { Save, X, Image, Camera, Edit3 } from 'lucide-react';
import { useContext, useState, useEffect } from "react";
import Context from "../../store/Context";
import TitleProfile from '../../assets/TitleProfile.svg';
import toast from 'react-hot-toast';
import { axiosInstance } from "../../lib/axios";

const EditPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const [post, setPost] = useState({});
    const [editedContent, setEditedContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { posts } = useContext(Context);

    useEffect(() => {
        if (posts && posts.length > 0 && postId) {
            const foundPost = posts.find(p => p.postId === parseInt(postId));
            if (foundPost) {
                setPost(foundPost);
                setEditedContent(foundPost.content || '');
                console.log("Found and set post:", foundPost);
            } else {
                console.log("Post not found with ID:", postId);
                toast.error("Post not found");
                navigate('/');
            }
        }
    }, [posts, postId, navigate]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (!editedContent || editedContent.trim().length === 0) {
                toast.error("Post content cannot be empty");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('post_id', post.postId.toString());
            formData.append('user_id', post.userId.toString());
            formData.append('content', editedContent.trim());
            
            console.log("Sending data:", {
                post_id: post.postId,
                user_id: post.userId,
                content: editedContent.trim(),
                hasSelectedImage: !!selectedImage
            });
            
            if (selectedImage && selectedImage !== post.mediaUrl) {
                if (selectedImage.startsWith('data:')) {
                    try {
                        const response = await fetch(selectedImage);
                        const blob = await response.blob();
                        const file = new File([blob], 'updated-image.jpg', { type: blob.type });
                        formData.append('file', file);
                        console.log("Added file to form data:", file.name, file.size);
                    } catch (fileError) {
                        console.error("Error processing image:", fileError);
                        toast.error("Error processing image file");
                        setIsLoading(false);
                        return;
                    }
                }
            }

            const response = await axiosInstance.put('/posts/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Update response:", response.data);

            if (response.status === 200) {
                toast.success("Post updated successfully!");
                navigate('/');
            }
        } catch (error) {
            console.error("Error updating post:", error);
            
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
                
                if (error.response.status === 400) {
                    const errorMessage = error.response.data?.error || error.response.data?.message || "Bad request - please check your input";
                    toast.error(errorMessage);
                } else if (error.response.status === 403) {
                    toast.error("You are not authorized to update this post");
                } else if (error.response.status === 404) {
                    toast.error("Post not found");
                } else {
                    toast.error(error.response.data?.error || error.response.data?.message || "Failed to update post");
                }
            } else if (error.request) {
                console.error("Network error:", error.request);
                toast.error("Network error - please check your connection");
            } else {
                console.error("Error:", error.message);
                toast.error("Failed to update post");
            }
            setIsLoading(false);
        }
    };

    const handleDiscard = () => {
        const hasChanges = editedContent !== post.content || selectedImage !== null;
        if (hasChanges) {
            const confirmDiscard = window.confirm("Are you sure you want to discard your changes?");
            if (confirmDiscard) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    if (!post.postId) {
        return (
            <div className={styles.loadingContainer}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading post...</p>
                </div>
            </div>
        );
    }

    return (    
        <div className={styles.editPostContainer}>
            <div className={styles.content}>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6">
                            
                            
                            <div className="card shadow-lg border-0">
                                <div className="card-header bg-gradient text-white">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <Edit3 size={20} className="me-2" />
                                        <span className="d-none d-sm-inline">Edit Post</span>
                                        <span className="d-inline d-sm-none">Edit</span>
                                    </h5>
                                </div>
                                
                                <div className="card-body p-4">
                                    
                                    <div className="d-flex align-items-center gap-2 gap-sm-3 mb-4 p-2 p-sm-3 bg-light rounded">
                                        <img 
                                            src={post.profilePicture || TitleProfile} 
                                            alt="profile" 
                                            className={styles.profileImage}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fs-6 fs-sm-5">{post.firstName} {post.lastName}</h6>
                                            <small className="text-muted d-block">
                                                <span className="d-none d-sm-inline">Editing post from your timeline</span>
                                                <span className="d-inline d-sm-none">Editing post</span>
                                            </small>
                                        </div>
                                    </div>

                                    
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-primary d-flex align-items-center">
                                            <Edit3 size={16} className="me-2" />
                                            Post Content
                                        </label>
                                        <textarea
                                            className={`form-control ${styles.contentTextarea}`}
                                            rows="4"
                                            placeholder="What's on your mind?"
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                        />
                                        <div className="form-text d-flex justify-content-between align-items-center flex-wrap">
                                            <span className="small">{editedContent.length} characters</span>
                                            <span className="text-muted small">
                                                {editedContent.length > 0 ? '✓ Content added' : 'Add some content...'}
                                            </span>
                                        </div>
                                    </div>

                                    
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-warning d-flex align-items-center">
                                            <Image size={16} className="me-2" />
                                            Media
                                        </label>
                                        
                                        
                                        {(selectedImage && selectedImage !== 'REMOVED') || (post.mediaUrl && !selectedImage) ? (
                                            <div className={`${styles.currentImageContainer} mb-3 text-center`}>
                                                <img 
                                                    src={selectedImage && selectedImage !== 'REMOVED' ? selectedImage : post.mediaUrl} 
                                                    alt="post media" 
                                                    className={`${styles.postImage} img-fluid`}
                                                />
                                                <div className={styles.imageOverlay}>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            if (selectedImage && selectedImage !== post.mediaUrl) {
                                                                setSelectedImage(null);
                                                            } else {
                                                                setSelectedImage('REMOVED');
                                                            }
                                                        }}
                                                        title="Remove image"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}

                                        
                                        <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-sm-start">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="d-none"
                                            />
                                            
                                            <label 
                                                htmlFor="imageUpload" 
                                                className="btn btn-outline-primary flex-fill flex-sm-grow-0"
                                            >
                                                <Image size={16} className="me-2" />
                                                <span className="d-none d-sm-inline">
                                                    {selectedImage && selectedImage !== 'REMOVED' ? 'Change Photo' : 
                                                     post.mediaUrl && selectedImage !== 'REMOVED' ? 'Change Photo' : 'Add Photo'}
                                                </span>
                                                <span className="d-inline d-sm-none">
                                                    {selectedImage && selectedImage !== 'REMOVED' ? 'Change' : 
                                                     post.mediaUrl && selectedImage !== 'REMOVED' ? 'Change' : 'Add'}
                                                </span>
                                            </label>
                                            
                                            <label 
                                                htmlFor="imageUpload" 
                                                className="btn btn-outline-secondary flex-fill flex-sm-grow-0"
                                            >
                                                <Camera size={16} className="me-2" />
                                                Camera
                                            </label>
                                        </div>
                                    </div>

                                    
                                    <div className="border-top pt-4">
                                        <h6 className="text-info mb-3 d-flex align-items-center flex-wrap">
                                            <span className="badge bg-info me-2 mb-1">Preview</span>
                                            <small className="text-muted">How your post will look</small>
                                        </h6>
                                        
                                        <div className="bg-light p-3 rounded">
                                            <div className="d-flex gap-2 gap-sm-3 mb-3">
                                                <img 
                                                    src={post.profilePicture || TitleProfile} 
                                                    alt="profile" 
                                                    className="rounded-circle" 
                                                    style={{height:'35px', width:'35px'}}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 small">{post.firstName} {post.lastName}</h6>
                                                    <small className="text-muted">Just now</small>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3">
                                                {editedContent ? (
                                                    <p style={{whiteSpace: 'pre-wrap'}} className="mb-0 small">
                                                        {editedContent}
                                                    </p>
                                                ) : (
                                                    <em className="text-muted small">Your content will appear here...</em>
                                                )}
                                            </div>
                                            
                                            {(selectedImage && selectedImage !== 'REMOVED') || (post.mediaUrl && selectedImage !== 'REMOVED') ? (
                                                <div className={`${styles.previewImageContainer} text-center`}>
                                                    <img 
                                                        src={selectedImage && selectedImage !== 'REMOVED' ? selectedImage : post.mediaUrl} 
                                                        alt="preview" 
                                                        className="img-fluid rounded"
                                                        style={{maxHeight: '200px'}}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            
                                <div className="card-footer bg-light border-0 d-flex justify-content-end gap-2 flex-column flex-sm-row">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary order-2 order-sm-1"
                                        onClick={handleDiscard}
                                        disabled={isLoading}
                                    >
                                        <X size={16} className="me-2" />
                                        <span className="d-none d-sm-inline">Discard Changes</span>
                                        <span className="d-inline d-sm-none">Discard</span>
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-primary order-1 order-sm-2"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span className="d-none d-sm-inline">Saving...</span>
                                                <span className="d-inline d-sm-none">Save...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="me-2" />
                                                <span className="d-none d-sm-inline">Save Post</span>
                                                <span className="d-inline d-sm-none">Save</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default EditPost;