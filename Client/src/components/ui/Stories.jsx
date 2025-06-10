import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Stories.module.css';
import { useContext } from "react";
import Context from "../../store/Context";
import TitleProfile from "../../assets/TitleProfile.svg";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const NextArrow = ({ onClick }) => (
  <div className={styles.nextArrow} onClick={onClick}>
    <FaChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className={styles.prevArrow} onClick={onClick}>
    <FaChevronLeft />
  </div>
);

const Stories = () => {
    const { allStories } = useContext(Context);
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    const handleCreateStory = () => {
        navigate('/story/create');
    }


    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5.5,
        slidesToScroll: 3,
        arrows: true,
        draggable: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

    const handleShowStory = (id) => {
        console.log(id);
        navigate (`/story/viewStory/${id}`);
    }

    return (
        <div className='container-fluid px-4 py-2 position-relative'>
            <Slider {...settings}>
                <div className="px-1" onClick={handleCreateStory}>
                        <div className="d-flex flex-column align-items-center story-item">
                            <div className={styles.storyContainer}>
                                <div className="d-flex align-items-center justify-content-center border border-2 border-white" style={{ height: '30px', width:'30px', position: 'absolute', top:'66%', left:'39%', right: '39%', backgroundColor: `#075CE5`, borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
                                    <Plus />
                                </div>
                                <img 
                                    src={authUser?.image || TitleProfile} 
                                    alt="Story" 
                                    className={styles.CreateStoryImage} 
                                />
                                <span className="text-center" 
                                    style={{ 
                                        fontSize: '12px', 
                                        color: '#000', 
                                        fontWeight: 'bold',
                                        position: 'absolute',
                                        bottom: '5px',  
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '100%',   
                                        textAlign: 'center'
                                    }}
                                >
                                    Create Story
                                </span>
                            </div>
                        </div>
                    </div>
                {allStories.map((story) => (
                    <div key={story.id} className="px-1" onClick={ () => handleShowStory (story.id) }>
                        <div className="d-flex flex-column align-items-center story-item">
                            <div className={styles.storyContainer}>
                                <div className={styles.profileIcon}>
                                    <img 
                                        src={story.profilePicture|| TitleProfile} 
                                        alt="Profile" 
                                        className={styles.profileImage}
                                    />
                                </div>
                                {story.media_url ?
                                <img 
                                    src={story.media_url || TitleProfile} 
                                    alt="Story" 
                                    className={styles.storyImage} 
                                /> : (
                                    <p className={styles.storyContent} >{story.storyContent}</p>
                                )}
                                <div className={styles.nameOverlay}>
                                    <span className={styles.storyName}>
                                        {story.firstName} {story.lastName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Stories;