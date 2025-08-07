import { useAuthStore } from "../store/useAuthStore";
import Logo from '../assets/Logo2.png';
import styles from './MessageContent.module.css';
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';
import { ImagePlus, CirclePlus, X, Phone, Video, CircleAlert, SendHorizontal } from "lucide-react";
import { useDropzone } from "react-dropzone";
import TitleProfile from '../assets/TitleProfile.svg'
import { useMessageStore } from "../store/useMessageStore";

const MessageContent = ({ selectedUser }) => {
    const { authUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true); 
    const [newMessage, setNewMessage] = useState('');
    const [friend, setFriend] = useState(null);
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [messageLoading, setMessageLoading] = useState(false);

    const { messages, getMessage, sendMessage, subscribeToMessage, unsubscribeFromMessage } = useMessageStore();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {'image/*': ['.jpeg', '.jpg', '.png', '.gif']},
        multiple: false,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            if (file) {
                setMediaPreview(URL.createObjectURL(file));
                setMediaFile(file);
            }
        },
        onDropRejected: () => {
            toast.error('Only images (JPEG, JPG, PNG, GIF) are allowed!');
        }
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };
    
    const messagesEndRef = useRef(null);
    const messagesListRef = useRef(null);

    useEffect(() => {
        const fetchFriend = async () => {
            if (selectedUser) {
                try {
                    const res = await axiosInstance.get(`/friends/friendId/${selectedUser}`);
                    setFriend(res.data);
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to fetch friend info');
                }
            }
        };
        fetchFriend();
    }, [selectedUser]);

    const scrollToBottom = () => {
        if (messagesListRef.current) {
            messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (!isLoading) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [isLoading, messages]);

      useEffect(() => {
        if (!selectedUser) return;


        const fetchMessages = async () => {
        try {
            setIsLoading(true);
            await getMessage(selectedUser);
            subscribeToMessage();
        } catch (err) {
            console.error(err);
            toast.error("Failed to load messages");
        } finally {
            setIsLoading(false);
            if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
        };

        fetchMessages();
        return () => {
            unsubscribeFromMessage();
        };
    }, [selectedUser, getMessage, subscribeToMessage, unsubscribeFromMessage]);


    const handleSendMessage = async(e) => {
        e.preventDefault();
        setMessageLoading(true);

        if (!newMessage && !mediaFile) {
            toast.error('Please enter a message or select a file to send');
            setMessageLoading(false);
            return;
        }

        try {
            await sendMessage(newMessage, mediaFile, selectedUser);
            setNewMessage("");
            setMediaFile(null);
            setMediaPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setMessageLoading(false);
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    return (
        <div className={styles.messageContent} style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
        }}>
            {!selectedUser && !friend ? (
                <div className={styles.welcomeContainer}>
                    <div className={styles.logoContainer}>
                        <img src={Logo} alt="Logo" className={styles.welcomeLogo} />
                    </div>
                    <h3>Welcome to Social Sphere!</h3>
                    <p>Send messages to your friends and communities</p>
                </div>
            ) : (
                <>
                <header className={styles.friendProfile}>
                    <div className="d-flex gap-2">
                        <img src={ (friend && friend.profile_picture_url) || TitleProfile} alt="" style={{height:'40px', width:'40px', borderRadius:'50%'}} />
                        <p>{friend?.first_name} {friend?.last_name}</p>
                    </div>

                    <div className="d-flex gap-2">
                        <div className={styles.attachmentIcon}>
                            <Phone size={20}/>
                        </div>
                        <div className={styles.attachmentIcon}>
                            <Video size={20}/>
                        </div>
                        <div className={styles.attachmentIcon}>
                            <CircleAlert size={20}/>
                        </div>
                    </div>

                </header>
                <div className={styles.chatWrapper}>
                    {isLoading ? (
                        <div className={styles.loaderOverlay}>
                            <div className={styles.loader}></div>
                        </div>
                    ) : (
                        <>
                            {messages.length === 0 ? (
                                <div className={styles.noMessagesContainer}>
                                    <p>Start a conversation with {friend?.first_name} {friend?.last_name}</p>
                                </div>
                            ) : (
                                <div className={styles.messagesList} ref={messagesListRef}>
                                    {Array.isArray(messages) && messages.map((message) => (
                                        <div 
                                            key={message?.id }
                                            className={`${styles.messageContainer} ${
                                                message.sender_id === authUser.id 
                                                ? styles.outgoingContainer 
                                                : styles.incomingContainer
                                            }`}
                                        >
                                            { message.sender_id !== authUser.id && (
                                                    <div className={styles.friendPro}>
                                                        <img src={friend?.profile_picture_url || TitleProfile} alt="" style={{ height: '35px' , width:'35px', borderRadius:'50%'}}/>
                                                    </div>
                                                )}
                                            <div className={`${styles.messageBubble} ${
                                                message.sender_id === authUser.id 
                                                ? styles.outgoing 
                                                : styles.incoming
                                            }`}>
                                                {message.media_url && (
                                                    <img 
                                                        src={message.media_url} 
                                                        alt="Media" 
                                                        className={styles.media} 
                                                    />
                                                )}
                                                <p>{message.content}</p>
                                                <span className={styles.timestamp}>
                                                    {message.created_at ? 
                                                        (() => {
                                                            const date = new Date(message.created_at);
                                                            return isNaN(date.getTime()) ? 
                                                                'Now' : 
                                                                date.toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                });
                                                        })() : 
                                                        'Now'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                                <div className={styles.inputSection}>
                                <div 
                                    {...getRootProps()} 
                                    className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive && (
                                        <div className={styles.dropzoneOverlay}>
                                            <div className={styles.dropzoneContent}>
                                                <ImagePlus size={40} />
                                                <p>Drop image here to upload</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {mediaPreview && (
                                    <div className={styles.mediaPreviewContainer}>
                                        <img 
                                            src={mediaPreview} 
                                            alt="Preview" 
                                            className={styles.mediaPreview} 
                                        />
                                        <button
                                            className={styles.removePreview}
                                            onClick={() => {
                                                URL.revokeObjectURL(mediaPreview);
                                                setMediaPreview(null);
                                                setMediaFile(null);
                                                fileInputRef.current.value = '';
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className={styles.messageInputContainer}>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setMediaPreview(URL.createObjectURL(file));
                                                setMediaFile(file);
                                            }
                                        }}
                                    />

                                    <div 
                                        type="button"
                                        className={styles.attachmentIcon}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        aria-label="Add attachment"
                                    >
                                        <CirclePlus size={20} />
                                    </div>

                                    <div 
                                        type="button"
                                        className={styles.attachmentIcon}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleImageUpload(e);
                                        }}
                                        aria-label="Add image"
                                    >
                                        <ImagePlus size={20} />
                                    </div>

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        aria-label="Message input"
                                    />
                                    
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage && !mediaFile}
                                        className={styles.sendButton}
                                        aria-label="Send message"
                                    >{messageLoading ? (
                                        <div className={styles.loaderOverlay}>
                                            <div className={styles.loader}></div>
                                        </div>  
                                    ) : ( <SendHorizontal /> )}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
                </>
            )}
        </div>
    );
}

export default MessageContent;