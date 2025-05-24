import { use, useEffect, useState, } from 'react';
import styles from './Messenger.module.css';
import { Ellipsis, MessageSquareShare, Search, EllipsisVertical, Lock, CircleUserRound, BellRing, ChevronDown } from 'lucide-react';
import TitleProfile from '../assets/TitleProfile.svg';
import { useAuthStore } from '../store/useAuthStore';
import { useMessageStore } from '../store/useMessageStore';
import MessageContent from '../components/MessageContent';
import { axiosInstance } from '../lib/axios';

const Messenger = () => {

    const [isInbox, setIsInbox] = useState(true);
    const [selectFriendId, setselectFriendId] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [activeFriendProfile, setActiveFriendProfile] = useState(null);

    const { authUser } = useAuthStore();

    const { getFriends, friends } = useMessageStore();

    useEffect( () => {
        getFriends(authUser.id);
    }, [getFriends, authUser] );
    
    useEffect(() => {
        const fetchSelectedFriendProfile = async () => {
            try {
                const response = await axiosInstance.get(`/users/friendProfile/${selectFriendId}`);
                setActiveFriendProfile(response.data);
            } catch (error) {
                console.error('Error fetching communities:', error);
            }
        };
        if (selectFriendId) {
            fetchSelectedFriendProfile();
        }
    }, [selectFriendId]);

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
                    {friends.map( (friend) => (
                        <div 
                            key={friend.id} 
                            className={`${styles.friendContainer} ${
                                selectFriendId === friend.id ? styles.activeFriend : ''
                            }`} 
                            onClick={() => setselectFriendId(friend.id)}
                        >
                            <div className='d-flex gap-2'>
                            <img 
                                src={friend.profile_picture_url || TitleProfile} 
                                alt="Profile" 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = TitleProfile;
                                }}
                                style={{ height: '50px', width: '50px', borderRadius: '50%'}} 
                            />
                                <p>{friend.first_name} {friend.last_name}</p>
                            </div>
                            {selectFriendId === friend.id && (
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
               <MessageContent selectedUser={selectFriendId}  />
            </div>
            { selectFriendId && (
            <div className={styles.rightSideBarContainer}>
                <div className='d-flex flex-column gap-3 pt-1 align-items-center justify-content-center'>
                    <div>
                        <img src={activeFriendProfile?.profile_picture_url} alt="Profile Picture" style={{ height: '90px', width: '90px', borderRadius: '50%'}}  />
                    </div>
                    <div>
                        <h4>{activeFriendProfile?.first_name} {activeFriendProfile?.last_name}</h4>
                        <p>time</p>
                    </div>
                </div>
                <div className='d-flex flex-column gap-2 align-items-center justify-content-center'>
                    <div className={styles.Encrypt}>
                        <span className={styles.EncryptContent}><Lock size={12} />End-to-end encrypted </span>
                    </div>
                    <div className='d-flex gap-4 justify-content-center mt-2'>
                        <button className={styles.Button}>
                            <CircleUserRound /> 
                        </button>
                        <button className={styles.Button}>
                            <BellRing />
                        </button>
                        <button className={styles.Button}>
                            <Search />
                        </button>
                    </div>
                </div>
                <div className={styles.activeProfileInfo}>
                    <div className={styles.activeInfo}>
                        <span>Chat Info</span>
                        <div>
                            <ChevronDown />
                        </div>
                    </div>
                    <div className={styles.activeInfo}>
                        <span>Customize Chat</span>
                        <div>
                            <ChevronDown />
                        </div>
                    </div>
                    <div className={styles.activeInfo}>
                        <span>Media & Files</span>
                        <div>
                            <ChevronDown />
                        </div>
                    </div>
                    <div className={styles.activeInfo}>
                        <span>Privacy & Supports</span>
                        <div>
                            <ChevronDown />
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default Messenger;