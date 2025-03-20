import styles from "./CreatePostContainer.module.css";
import { Image, Gift, TextQuote, Smile, CalendarClock, MessageCirclePlus, X, Tags, ImagePlus } from "lucide-react";
import TitleProfile from "../../assets/TitleProfile.svg";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

const CreatePostContainer = () => {
    const { authUser } = useAuthStore();
    const [modal, setModal] = useState(false);
    const postContent = useRef();
    const [privacy, setPrivacy] = useState("public");
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaFile, setMediaFile] = useState(null); 
    const [ dragNdrop, setDragNdrop ] = useState(false);

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
        if (!postContent.current?.value.trim() && !mediaFile) {
            console.log("No content or media to post.");
            return;
        }

        try {
            const formData = new FormData();
            if (mediaFile) {
                formData.append("file", mediaFile);
            }
            formData.append("user_id", authUser.id);
            formData.append("content", postContent.current?.value.trim());
            formData.append("privacy_setting", privacy);
            formData.append("created_at", new Date().toISOString());
            formData.append("updated_at", new Date().toISOString());

            const response = await axiosInstance.post("/posts/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Post created:", response.data);

            setModal(false);
            postContent.current.value = "";
            setPrivacy("public");
            setMediaPreview(null);
            setMediaFile(null);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };



    return (
        <>
            <div className={`${styles.CreatePostContainer} card bg-color-white rounded shadow border-0`}>
                <div className="card-body p-3 p-md-3">
                    <div className="d-flex flex-column text-start ">
                        <div className="d-flex align-items-center gap-3 p-1">
                            <img
                                src={authUser?.image || TitleProfile}
                                alt="Profile"
                                style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                            />
                            <div className="w-100">
                                <button
                                    className={`${styles.createPostButton} btn w-100 border rounded text-start`}
                                    onClick={() => setModal(true)}
                                >
                                    {`What's happening, ${authUser?.first_name}?`}
                                </button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex gap-3 ms-4 mt-3 ps-5">
                                <div><Image /></div>
                                <div><Gift /></div>
                                <div><TextQuote /></div>
                                <div><Smile /></div>
                                <div><CalendarClock /></div>
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
                                    disabled={!postContent.current?.value.trim() && !mediaFile}
                                    onClick={handleCreatePost}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePostContainer;
