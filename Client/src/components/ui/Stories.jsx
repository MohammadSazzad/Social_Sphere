import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Stories.module.css';
import { useContext } from "react";
import Context from "../../store/Context";
import TitleProfile from "../../assets/TitleProfile.svg";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Plus } from 'lucide-react'
import { jwtDecode } from 'jwt-decode';

// Custom arrow components
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
    const { stories } = useContext(Context);
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;

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

    return (
        <div className='container-fluid px-4 py-2 position-relative'>
            <Slider {...settings}>
                <div className="px-1">
                        <div className="d-flex flex-column align-items-center story-item">
                            <div className={styles.storyContainer}>
                                <div className="d-flex align-items-center justify-content-center border border-2 border-white" style={{ height: '30px', width:'30px', position: 'absolute', top:'66%', left:'39%', right: '39%', backgroundColor: `#075CE5`, borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
                                    <Plus />
                                </div>
                                <img 
                                    src={decoded.image || TitleProfile} 
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
                {stories.map((story) => (
                    <div key={story.id} className="px-1">
                        <div className="d-flex flex-column align-items-center story-item">
                            <div className={styles.storyContainer}>
                                <div className={styles.profileIcon}>
                                    <img 
                                        src={story.profileImage || TitleProfile} 
                                        alt="Profile" 
                                        className={styles.profileImage}
                                    />
                                </div>
                                <img 
                                    src={story.image || TitleProfile} 
                                    alt="Story" 
                                    className={styles.storyImage} 
                                />
                                <div className={styles.nameOverlay}>
                                    <span className={styles.storyName}>
                                        Mohammad Sazzad
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