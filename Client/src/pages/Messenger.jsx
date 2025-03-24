import { useEffect, useState } from 'react';
import styles from './Messenger.module.css';
import { Ellipsis, MessageSquareShare, Search, EllipsisVertical } from 'lucide-react';
import TitleProfile from '../assets/TitleProfile.svg'
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';

const Messenger = () => {

    const [isInbox, setIsInbox] = useState(true);
    const [activeFriendId, setActiveFriendId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [communities, setCommunities] = useState([]);

    const { authUser } = useAuthStore();

    useEffect(() => {
        axiosInstance.get(`/friends/${authUser.id}`)
        .then( response => {
            setFriends(response.data.map( (item) => ({
                id: item.id,
                firstName: item.first_name,
                lastName: item.last_name,
                profilePicture: item.profile_picture_url,
            })));
        })
        .catch( error => {
            console.log(error);
        });
    }, []);

    console.log(friends);

    return (
        <div className={styles.container}>
            <div className={styles.leftSideBarContainer}>
                <div className='d-flex flex-column gap-3 pt-1' >
                    <div className='d-flex justify-content-between'>
                        <h3>Messages</h3>
                        <div className='d-flex gap-2'>
                            <div className={styles.Button}>
                                <Ellipsis size={18}/>
                            </div>
                            <div className={styles.Button}>
                                <MessageSquareShare size={18}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <form className={`d-none d-md-flex ${styles.searchForm}`}>
                            <div className={`input-group ${styles.inputGroupRounded}`}>
                                <button
                                type="button"
                                className={`input-group-text bg-light border-0 ${styles.noFocusOutline}`}
                                >
                                    <Search size={18} />
                                </button>

                                <input
                                type="text"
                                className={`form-control border-0 bg-light ${styles.noFocusOutline}`}
                                placeholder="Search Messages"
                                />
                            </div>
                        </form>

                    </div>
                    <div className='d-flex gap-2'>
                        <div className={`${styles.opButton} ${isInbox && styles.active}`} onClick={() => setIsInbox(true)}>Inbox</div>
                        <div className={`${styles.opButton2} ${!isInbox && styles.active}`} onClick={() => setIsInbox(false)}>Communities</div>
                    </div>
                </div>
                <div className='mt-1 mb-1' style={{
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                }}>
                    {friends.map((friend) => (
                        <div 
                            key={friend.id} 
                            className={`${styles.friendContainer} ${
                                activeFriendId === friend.id ? styles.activeFriend : ''
                            }`} 
                            onClick={() => setActiveFriendId(friend.id)}
                        >
                            <div className='d-flex gap-2'>
                                <img 
                                    src={friend.profile_picture_url || TitleProfile} 
                                    alt="Profile" 
                                    style={{ height: '50px', width: '50px', borderRadius: '50%'}} 
                                />
                                <p>{friend.firstName} {friend.lastName}</p>
                            </div>
                            {activeFriendId === friend.id && (
                                <div className={`${styles.Button}`}>
                                    <EllipsisVertical  size={18}/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div>

                </div>
            </div>
            <div className={styles.messagesContainer}>
                Messages
            </div>
            <div className={styles.rightSideBarContainer}>
                Right Side Bar
            </div>
        </div>
    );
}

export default Messenger;