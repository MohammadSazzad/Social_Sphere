import { useNavigate, useParams } from "react-router-dom";
import styles from './ShowStory.module.css';
import { Plus, X, Heart, Smile, Angry, Annoyed , ThumbsUp, Laugh, ThumbsDown } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useContext, useEffect, useState } from "react";
import Context from "../store/Context";
import TitleProfile from "../assets/TitleProfile.svg";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

const ShowStory = () => {

    const { id } = useParams();
    console.log(id);
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const navigate = useNavigate();
    const { stories, formatTimeDifference } = useContext(Context);
    const [ storyById, setStoryById ] = useState([]);

    useEffect( () => {
        axiosInstance.get(`/stories/show/${id}`)
        .then( response => {
            setStoryById(response.data);
        })
        .catch( error => {
            console.log(error);
        })
    }, [id]);


    const handleBackButton = () => {
        navigate('/');
    }
    const handleCreateStoryButton = () => {
        navigate('/story/create');
    }

    return (
        <div className={styles.showStoryContainer}>
            <div className={styles.sideBar} style={{
            position: "fixed", 
            top: 0,
            left: 0,
            width: "380px",
            height: "100vh", 
            overflowY: "auto", 
        }}> 
                <div className="d-flex justify-content-between pt-1">
                    <h4>Stories</h4>
                    <div type='button' className={styles.Button} onClick={handleBackButton}> <X /> </div>   
                </div>
                <div className="d-flex gap-2">
                    <a href="!#" className="text-decoration-none">Archive</a>
                    <a href="!#" className="text-decoration-none">Setings</a>
                </div>
                <div>
                    <p className="fw-medium pt-3">Your Story</p>
                </div>
                <div className="d-flex gap-2">
                    <div className={styles.Button} style={{height: '60px', width:'60px'}} onClick={handleCreateStoryButton}> <Plus /> </div>
                    <div className={styles.smallGap} >
                        <p className="fw-medium ">Create a Story</p>
                        <p className="fw-light">Share a photo or write something</p>
                    </div>
                </div>
                <div> 
                    <p className="pt-3 fw-medium">All Stories</p>
                    <div>
                        {stories.map( (story) => (
                            <div key={story.id} className="d-flex gap-2 pt-2 pb-2">
                                <img src={story.profileImage || TitleProfile} alt="story's owner image" style={{ height:'60px', width: '60px', borderRadius:'50%'}} />
                                <div className={styles.smallGap}>
                                    <p className="fw-medium">{story.firstName} {story.lastName}</p>
                                    <p className="fw-light">{formatTimeDifference(story.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.content}>

                <div className={styles.storyContainer}>
                    <div className={styles.story}>
                        <div className="d-flex p-2">
                            <div>
                                <img src={storyById.profile_picture_url || TitleProfile} alt="profile" style={{height: '48px', width: '48px', borderRadius: '50%'}} />
                            </div>
                            <div className={`${styles.smallGap} ps-3`}>
                                <p>{storyById.first_name} {storyById.last_name}</p>
                                <p>{(storyById.created_at)}</p>
                            </div>
                        </div>
                        {storyById.media_url ? (
                            <div className={styles.storyContent}>
                                <div className="mt-5 pt-5" >
                                    <p>{storyById.storycontent}</p>
                                </div>
                                <img className={styles.storyContentImage} src={storyById.media_url} alt="Story" />
                            </div>
                        ) : (
                            <div className={styles.storyContentx}>
                                <p >{storyById.storycontent}</p>
                            </div>
                        )}
                    </div>
                    <div className="d-flex gap-2 p-2">
                        <div>
                            <input type="text" placeholder="Reply." className={styles.inputRegion}/>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <div className={styles.emojiButton}>
                                <Laugh />
                            </div>
                            <div className={styles.emojiButton}>
                                <Heart />
                            </div> 
                            <div className={styles.emojiButton}>  
                                <Smile />
                            </div>
                            <div className={styles.emojiButton}>
                                <ThumbsUp />
                            </div>
                            <div className={styles.emojiButton}>
                                <Annoyed />
                            </div>
                            <div className={styles.emojiButton}>
                                <ThumbsDown />
                            </div>
                            <div className={styles.emojiButton}>
                                <Angry />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ShowStory;