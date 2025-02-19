import styles from './CreatePostContainer.module.css';
import { Image, Gift, TextQuote, Smile, CalendarClock } from 'lucide-react';
import TitleProfile from '../../assets/TitleProfile.svg';
import { jwtDecode } from 'jwt-decode';

const CreatePostContainer = () => {

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);



    return (
        <div className={`${styles.CreatePostContainer} card bg-color-white rounded shadow border-0`}>
            <div className="card-body p-3 p-md-3">
                <div className="d-flex flex-column text-start ">
                    <div className='d-flex align-items-center gap-3 p-1  rounded '>
                        <img src={decoded.image || TitleProfile} alt="Profile Image" style={{ height: "48px", width: "48px", borderRadius: "50%" }}/>
                        <div className='w-100'>
                            <input type="text" className="form-control w-100 p-2 fs-5 " style={{borderRadius: "20px", backgroundColor: "#F8F9FA"}}  placeholder={`What's happening, ${decoded.first_name}?`}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className='d-flex gap-3 ms-4 mt-3'>
                            <div><Image /></div>
                            <div><Gift /></div>
                            <div><TextQuote /></div>
                            <div><Smile /></div>
                            <div><CalendarClock /></div>                          
                        </div>
                        <button className='btn btn-primary'>Post</button>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default CreatePostContainer;