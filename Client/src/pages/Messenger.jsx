import { useContext, useEffect, useState } from 'react';
import styles from './Messenger.module.css';
import { Ellipsis, MessageSquareShare, Search, EllipsisVertical, Lock, CircleUserRound, BellRing, ChevronDown } from 'lucide-react';
import TitleProfile from '../assets/TitleProfile.svg';
import { useAuthStore } from '../store/useAuthStore';
import { useMessageStore } from '../store/useMessageStore';
import MessageContent from '../components/MessageContent';
import { axiosInstance } from '../lib/axios';
import SearchBarInMessage from '../components/ui/SearchBarInMessage';
import Context from '../store/Context';
import SearchResultsList from '../components/ui/SearchResultsList';

const Messenger = () => {
    const [isInbox, setIsInbox] = useState(true);
    const [activeFriendProfile, setActiveFriendProfile] = useState(null);
    const { searchTerm, selectFriendId, setselectFriendId } = useContext(Context);  

    const { authUser } = useAuthStore();
    const { getFriends, friends } = useMessageStore();

    useEffect(() => {
        getFriends(authUser.id);
    }, [getFriends, authUser.id]);  

    useEffect(() => {
        const fetchSelectedFriendProfile = async () => {
            try {
                const response = await axiosInstance.get(`/users/friendProfile/${selectFriendId}`);
                setActiveFriendProfile(response.data);
            } catch (error) {
                console.error('Error fetching friend profile:', error);
            }
        };
        if (selectFriendId) {
            fetchSelectedFriendProfile();
        }
    }, [selectFriendId]);

    return (
        <div className={styles.container}>
            <div className={styles.leftSideBarContainer}>
                <div className='d-flex flex-column gap-3 pt-1'>
                    <div className='d-flex justify-content-between'>
                        <h3>Messages</h3>
                        <div className='d-flex gap-2'>
                            <div className={styles.Button}>
                                <Ellipsis size={18} />
                            </div>
                            <div className={styles.Button}>
                                <MessageSquareShare size={18} />
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
                                <SearchBarInMessage />
                            </div>
                        </form>
                    </div>
                    {searchTerm && searchTerm.trim() !== '' ? (
                        <SearchResultsList />
                    ) : (
                        <>
                            <div className='d-flex gap-2'>
                                <div className={`${styles.opButton} ${isInbox && styles.active}`} onClick={() => setIsInbox(true)}>Inbox</div>
                                <div className={`${styles.opButton2} ${!isInbox && styles.active}`} onClick={() => setIsInbox(false)}>Communities</div>
                            </div>
                            <div className='mt-1 mb-1' style={{
                                maxHeight: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                            }}>
                                {friends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        className={`${styles.friendContainer} ${selectFriendId === friend.id ? styles.activeFriend : ''
                                            }`}
                                        onClick={() => setselectFriendId(friend.id)}
                                    >
                                        <div className='d-flex gap-2 align-items-center'>
                                            <img
                                                src={friend.profile_picture_url || TitleProfile}
                                                alt="Profile"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = TitleProfile;
                                                }}
                                                style={{ height: '50px', width: '50px', borderRadius: '50%' }}
                                            />
                                            <p>{friend.first_name} {friend.last_name}</p>
                                        </div>
                                        {selectFriendId === friend.id && (
                                            <div className={`${styles.Button}`}>
                                                <EllipsisVertical size={18} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.messagesContainer}>
                <MessageContent selectedUser={selectFriendId} />
            </div>
            {selectFriendId && activeFriendProfile && (  
                <div className={styles.rightSideBarContainer}>
                    <div className='d-flex flex-column gap-3 pt-1 align-items-center justify-content-center'>
                        <div>
                            <img 
                                src={activeFriendProfile.profile_picture_url || TitleProfile} 
                                alt="Profile" 
                                style={{ height: '90px', width: '90px', borderRadius: '50%' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = TitleProfile;
                                }}
                            />
                        </div>
                        <div className='text-center'>
                            <h4>{activeFriendProfile.first_name} {activeFriendProfile.last_name}</h4>
                            <p>Active now</p> 
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
                        <details className={styles.activeInfo}>
                            <summary>
                                <span>Chat Info</span>
                                <ChevronDown size={16} />
                            </summary>
                        </details>
                        <details className={styles.activeInfo}>
                            <summary>
                                <span>Customize Chat</span>
                                <ChevronDown size={16} />
                            </summary>
                        </details>
                        <details className={styles.activeInfo}>
                            <summary>
                                <span>Media & Files</span>
                                <ChevronDown size={16} />
                            </summary>
                        </details>
                        <details className={styles.activeInfo}>
                            <summary>
                                <span>Privacy & Support</span> 
                                <ChevronDown size={16} />
                            </summary>
                        </details>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messenger;