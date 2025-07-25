import styles from "./CreatePostContainer.module.css";
import { Image, Gift, TextQuote, Smile, CalendarClock, MessageCirclePlus, X, Tags, ImagePlus } from "lucide-react";
import TitleProfile from "../../assets/TitleProfile.svg";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";
import toast, { Toaster } from "react-hot-toast";

const CreatePostContainer = () => {
    const { authUser } = useAuthStore();
    const [modal, setModal] = useState(false);
    const postContent = useRef();
    const [privacy, setPrivacy] = useState("public");
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaFile, setMediaFile] = useState(null); 
    const [ dragNdrop, setDragNdrop ] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = () => {
        setDragNdrop(true);
    };
    
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setMediaPreview(previewURL);
            setMediaFile(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleCreatePost = async () => {
        const content = postContent.current?.value.trim() || '';
        if (!content && !mediaFile) {
            toast.error("Please add content or media to create a post");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Creating your post...");

        try {
            const formData = new FormData();
            if (mediaFile) {
                formData.append("file", mediaFile);
            }
            formData.append("user_id", authUser.id);
            formData.append("content", content);
            formData.append("privacy_setting", privacy);

            const response = await axiosInstance.post("/posts/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Post created successfully!", { id: toastId });
            
            toast.success("Post created successfully!", { 
                id: toastId,
                style: {
                    background: '#51cf66',
                    color: '#fff',
                },  
            });
            setModal(false);
            if (postContent.current) postContent.current.value = "";
            setPrivacy("public");
            setMediaPreview(null);
            setMediaFile(null);
            setDragNdrop(false);
        } catch (error) {
            console.error("Error creating post:", error);
            

            if (error.response?.status === 400 && 
                error.response.data?.error?.includes("prohibited content")) {
                toast.error("Post rejected: Contains prohibited content", { 
                    id: toastId,
                    icon: '🚫',
                    style: {
                        background: '#ff6b6b',
                        color: '#fff',
                    },
                });
            } else {
                let errorMessage = "Failed to create post. Please try again.";
                if (error.response?.data?.error) {
                    errorMessage = error.response.data.error;
                }
                toast.error(errorMessage, { 
                    id: toastId,
                    style: {
                        background: '#ff6b6b',
                        color: '#fff',
                    },
                });
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.createPostWrapper}>
            <div className={`${styles.CreatePostContainer} card bg-color-white rounded shadow border-0`}>
                <div className={`card-body ${styles.cardBody}`}>
                    <div className="d-flex flex-column text-start">
                        <div className={`d-flex align-items-center justify-content-between ${styles.postTriggerContainer}`}>
                            <div className={`d-flex align-items-center gap-3 ${styles.postTrigger}`}>
                                <img
                                    src={authUser?.image || TitleProfile}
                                    alt="Profile"
                                    className={styles.profileImage}
                                />
                                <div className="flex-grow-1">
                                    <button
                                        className={`${styles.createPostButton} btn w-100 border rounded text-start`}
                                        onClick={() => setModal(true)}
                                    >
                                        {`What's happening, ${authUser?.first_name}?`}
                                    </button>
                                </div>
                            </div>
                            <div className={`${styles.mobileImageIcon} d-xl-none`}>
                                <button className={styles.actionIcon} onClick={handleFileChange}>
                                    <Image size={20} />
                                </button>
                            </div>
                        </div>
                        <div className={`d-none d-xl-flex justify-content-between ${styles.actionsContainer}`}>
                            <div className={`d-flex gap-3 ${styles.actionIcons}`}>
                                <button className={styles.actionIcon} onClick={handleFileChange}>
                                    <Image size={20} />
                                </button>
                                <button className={styles.actionIcon}><Gift size={20} /></button>
                                <button className={styles.actionIcon}><TextQuote size={20} /></button>
                                <button className={styles.actionIcon}><Smile size={20} /></button>
                                <button className={styles.actionIcon}><CalendarClock size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modal && (
                <div className={styles.modalBackdrop} onClick={() => setModal(false)}>
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h5 className="m-0">Create Post</h5>
                            <button className={styles.closeButton} onClick={() => setModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <img
                                    src={authUser?.image || TitleProfile}
                                    className="rounded-circle"
                                    style={{ width: "40px", height: "40px" }}
                                    alt="Profile"
                                />
                                <div>
                                    <h6 className="m-0">{authUser.first_name + " " + authUser.last_name }</h6>
                                    <select
                                        className={styles.privacySelect}
                                        value={privacy}
                                        onChange={(e) => setPrivacy(e.target.value)}
                                    >
                                        <option value="public">🌍 Public</option>
                                        <option value="friends">👥 Friends</option>
                                        <option value="private">🔒 Only me</option>
                                    </select>
                                </div>
                            </div>

                            <textarea
                                className={styles.postTextarea}
                                placeholder="What's on your mind?"
                                ref={postContent}
                                autoFocus
                            />
                            { dragNdrop && <div {...getRootProps()} className={styles.mediaPreviewContainer}>
                                <input {...getInputProps()} />
                                {mediaPreview ? (
                                    <div className={styles.mediaPreview}>
                                        <img src={mediaPreview} alt="Media preview" />
                                        <button className={styles.closeButton} onClick={() => setMediaPreview(null)}>
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <button className={styles.closeButtonDrag} onClick={() =>  setDragNdrop(false) }>
                                            <X size={18} />
                                        </button>
                                        <ImagePlus />
                                        <p>Drag and drop your media here or click to select</p>
                                    </div> 

                                )}
                            </div> }
                        </div>

                        <div className={`${styles.modalMedia} shadow-sm`}>
                            <p>Add to your post</p>
                            <div className="d-flex gap-2">
                                <button className={styles.mediaButton} onClick={handleFileChange}>
                                    <Image size={20} />
                                </button>
                                <button className={styles.mediaButton}>
                                    <Tags />
                                </button>
                                <button className={styles.mediaButton}>
                                    <Smile size={20} />
                                </button>
                                <button className={styles.mediaButton}>
                                    <MessageCirclePlus size={20} />
                                </button>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <button
                                    className={styles.postButton}
                                    disabled={(!postContent.current?.value.trim() && !mediaFile) || isUploading}
                                    onClick={handleCreatePost}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                    {isUploading && (
                        <div className={styles.loaderOverlay}>
                            <div className={styles.loader}></div>
                        </div>
                    )}
                </div>
            )}
            
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 5000,
                    success: {
                        style: {
                            background: '#51cf66',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#ff6b6b',
                            color: '#fff',
                        },
                    },
                    loading: {
                        style: {
                            background: '#4dabf7',
                            color: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
};

export default CreatePostContainer;