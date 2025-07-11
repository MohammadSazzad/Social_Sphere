import styles from './CreateStory.module.css';
import { Settings, ImagePlus, CaseSensitive, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
const CreateStory = () => {
    const { authUser } = useAuthStore();
    const [ createImage, setImage ] = useState(false);
    const [ createText, setText ] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [description, setDescription] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const title = useRef();
    const textDes = useRef();
    const navigate = useNavigate();

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setMediaPreview(previewURL);
            setMediaFile(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleContinueButton = async(e) => {
        setIsLoading (true);
        e.preventDefault();
        if (!mediaFile && (!description || (description && !title.current?.value?.trim()))) {
            console.log('No content to post');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', mediaFile);
            formData.append('user_id', authUser.id);
            formData.append('created_at', new Date().toISOString());
            formData.append('storyContent', title.current.value.trim());
            const response = await axiosInstance.post('/stories/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Story created:', response.data);
            setImage(false);
            setText(false);
            setMediaPreview(null);
            setDescription(false);
            navigate('/');

        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }

        e.reset.target();
    }

    const handleShareToStory = async(e) => {
        e.preventDefault();
        if(!textDes.current.value.trim()){
            console.log('No content or media to post');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/stories/createContent', {
                user_id: authUser.id,
                created_at: new Date().toISOString(),
                storyContent: textDes.current.value.trim(),
            })
            console.log('Story created:', response.data);
            setText(false);
            navigate('/');

        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }

        e.reset.target();
    }

    return (
        <div className={styles.createStory}>
            <div className={styles.sideBar}>
                <div className={styles.sideBarContainer}>
                    <div className={styles.sideBarContent}>
                        <div className='d-flex justify-content-between'>
                            <h3>Create Story</h3>
                            <button className={styles.SettingsButton}><Settings size={25}/></button>
                        </div>
                        <div className='d-flex align-items-start gap-2 text-body pt-2'>
                            <img src={authUser.image} alt="profile" className={styles.profileImage} />
                            <p className='p-2'>{authUser.first_name} {authUser.last_name}</p>
                        </div>
                        <hr />
                        { mediaPreview && (
                            <div type='button' className='d-flex' onClick={() => setDescription(true)}>
                                <div className={styles.createStoryCardTextIcon}>
                                    <CaseSensitive />
                                </div>
                                <p className='p-3'>Add text</p>
                            </div>
                        )}
                    </div>
                    {mediaPreview  && (
                        <div className={`d-flex flex-column ${styles.footerContainer}`}>
                            <div className={styles.footer}>
                                <button className='btn btn-secondary btn-lg' onClick={() => {setImage(false); setText(false); setMediaPreview(false); setDescription(false)}}>Discard</button>
                                <button className='btn btn-primary btn-lg' onClick={handleContinueButton} disabled={isLoading}>Continue</button>
                            </div>
                        </div>
                    )}
                    {createText  && (
                        <div className={`d-flex flex-column ${styles.footerContainer}`}>
                            <div className={styles.footer}>
                                <button className='btn btn-secondary btn-lg' onClick={() => {setImage(false); setText(false); setMediaPreview(false); setDescription(false)}}>Discard</button>
                                <button className='btn btn-primary btn-lg' onClick={handleShareToStory} disabled={isLoading}>Share to Story</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            { !createImage && !createText && 
                <div className={styles.content}>
                    <div className='d-flex gap-3 '>
                        <div type='button' className={styles.createStoryCardImage} onClick={() => setImage(true)}>
                            <div className={styles.createStoryCardImageIcon}>
                                <ImagePlus />
                            </div>
                            <p>Create Image Story</p>
                        </div>
                        <div type='button' className={styles.createStoryCardText} onClick={() => setText(true)}>
                            <div className={styles.createStoryCardTextIcon}>
                                <CaseSensitive />
                            </div>
                            <p>Create Text Story</p>
                        </div>
                    </div>
                </div>
            }
            { createImage && 
                <div className={styles.content}>
                    <div {...getRootProps()} className={styles.mediaPreviewContainer}>
                        <input {...getInputProps()} />
                        {description &&  <input type="text" placeholder='Start typing..' className={styles.description} ref={title} /> }
                        {mediaPreview ? (
                            <div>
                                <div className={styles.mediaPreview}>
                                    <img src={mediaPreview} alt="Media preview" />
                                    <button className={styles.closeButton} onClick={() => setMediaPreview(null)}>
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center gap-1">
                                <button className={styles.closeButtonDrag} onClick={() => setImage(false)}>
                                    <X size={18} />
                                </button>
                                <ImagePlus />
                                <p>Drag and drop your media here or click to select</p>
                            </div> 

                        )}
                    </div>
                </div>
            }
            { createText && 
                <div className={styles.content}>
                <textarea className={styles.textContainer} placeholder="Start typing.." ref={textDes}></textarea>
                </div>
            
            }
            {isLoading && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.loader}></div>
                </div>
            )}
            
        </div>
    )   
}

export default CreateStory;