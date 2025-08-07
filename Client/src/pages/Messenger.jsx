import { useContext, useEffect, useState } from 'react';
import styles from './Messenger.module.css';
import { Ellipsis, MessageSquareShare, Search, EllipsisVertical, Lock, CircleUserRound, BellRing, ChevronDown, ArrowLeft, X } from 'lucide-react';
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
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [showMobileProfile, setShowMobileProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { searchTerm, selectFriendId, setselectFriendId } = useContext(Context);  

    const { authUser, onlineUsers } = useAuthStore();
    const { getFriends, friends } = useMessageStore();

    useEffect(() => {
        if (authUser?.id) {
            getFriends(authUser.id);
        }
    }, [getFriends, authUser?.id]);  

    useEffect(() => {
        const fetchSelectedFriendProfile = async () => {
            if (!selectFriendId) {
                setActiveFriendProfile(null);
                return;
            }

            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/users/friendProfile/${selectFriendId}`);
                setActiveFriendProfile(response.data);
            } catch (error) {
                console.error('Error fetching friend profile:', error);
                setActiveFriendProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSelectedFriendProfile();
    }, [selectFriendId]);

    const handleFriendSelect = (friendId) => {
        setselectFriendId(friendId);
        setShowMobileChat(true);
        setShowMobileProfile(false);
    };

    const handleBackToFriends = () => {
        setShowMobileChat(false);
        setShowMobileProfile(false);
        setselectFriendId(null);
    };

    const toggleMobileProfile = () => {
        setShowMobileProfile(!showMobileProfile);
    };

    return (
        <div className={styles.messengerContainer}>
            <div className={`${styles.leftSidebar} ${showMobileChat ? styles.hiddenOnMobile : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <h3 className={styles.title}>Messages</h3>
                        <div className={styles.headerIcons}>
                            <button className={styles.iconButton}>
                                <Ellipsis size={18} />
                            </button>
                            <button className={styles.iconButton}>
                                <MessageSquareShare size={18} />
                            </button>
                        </div>
                    </div>
                    <div className={styles.searchContainer}>
                        <form className={styles.searchForm}>
                            <div className={styles.inputGroup}>
                                <Search size={18} className={styles.searchIcon} />
                                <SearchBarInMessage />
                            </div>
                        </form>
                    </div>
                    {searchTerm && searchTerm.trim() !== '' ? (
                        <SearchResultsList />
                    ) : (
                        <>
                            <div className={styles.filterTabs}>
                                <button 
                                    className={`${styles.filterTab} ${isInbox ? styles.active : ''}`}
                                    onClick={() => setIsInbox(true)}
                                >
                                    Inbox
                                </button>
                                <button 
                                    className={`${styles.filterTab} ${!isInbox ? styles.active : ''}`}
                                    onClick={() => setIsInbox(false)}
                                >
                                    Communities
                                </button>
                            </div>
                        </>
                    )}
                </div>
                
                <div className={styles.friendsList}>
                    {!searchTerm && friends.map((friend) => (
                        <div
                            key={friend.id}
                            className={`${styles.friendItem} ${selectFriendId === friend.id ? styles.active : ''}`}
                            onClick={() => handleFriendSelect(friend.id)}
                        >
                            <div className={styles.friendAvatar}>
                                <img
                                    src={friend.profile_picture_url || TitleProfile}
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = TitleProfile;
                                    }}
                                />
                                {onlineUsers.includes(friend.id.toString()) && (
                                    <div className={styles.onlineStatus}></div>
                                )}
                            </div>
                            <div className={styles.friendInfo}>
                                <h4 className={styles.friendName}>{friend.first_name} {friend.last_name}</h4>
                                <p className={styles.lastMessage}>
                                    {friend.lastMessage || "Start a conversation..."}
                                </p>
                            </div>
                            <div className={styles.messageActions}>
                                {selectFriendId === friend.id && (
                                    <button className={styles.actionButton}>
                                        <EllipsisVertical size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`${styles.mainChat} ${!selectFriendId && !showMobileChat ? styles.hiddenOnMobile : ''}`}>
                {selectFriendId ? (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderLeft}>
                                <button 
                                    className={styles.backButton} 
                                    onClick={handleBackToFriends}
                                >
                                    <ArrowLeft size={20} className={styles.backIcon} />
                                </button>
                                <div className={styles.chatAvatar}>
                                    <img
                                        src={activeFriendProfile?.profile_picture_url || TitleProfile}
                                        alt="Profile"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = TitleProfile;
                                        }}
                                    />
                                    <div className={styles.onlineIndicator}></div>
                                </div>
                                <div className={styles.chatUserInfo}>
                                    <h3 className={styles.chatUserName}>
                                        {isLoading ? 'Loading...' : `${activeFriendProfile?.first_name || ''} ${activeFriendProfile?.last_name || ''}`.trim()}
                                    </h3>
                                    <p className={styles.chatUserStatus}>
                                        {onlineUsers.includes(selectFriendId?.toString()) ? 'Active now' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.chatHeaderRight}>
                                <button 
                                    className={styles.menuButton}
                                    onClick={toggleMobileProfile}
                                >
                                    <EllipsisVertical size={18} />
                                </button>
                            </div>
                        </div>
                        <div className={styles.messageArea}>
                            <MessageContent selectedUser={selectFriendId} />
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyChat}>
                        <div className={styles.emptyChatContent}>
                            <MessageSquareShare className={styles.emptyChatIcon} size={64} />
                            <h3>Select a chat to start messaging</h3>
                            <p>Choose from your existing conversations, or start a new one.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className={`${styles.rightSidebar} ${showMobileProfile ? styles.showOnMobile : ''}`}>
                {selectFriendId && activeFriendProfile && (
                    <div className={styles.profileSection}>
                        <div className={styles.profileHeader}>
                            <button 
                                className={styles.closeProfileButton}
                                onClick={() => setShowMobileProfile(false)}
                            >
                                <X size={20} className={styles.closeIcon} />
                            </button>
                        </div>
                        
                        <div className={styles.profileInfo}>
                            <div className={styles.profileAvatar}>
                                <img 
                                    src={activeFriendProfile.profile_picture_url || TitleProfile} 
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = TitleProfile;
                                    }}
                                />
                            </div>
                            <div className={styles.profileDetails}>
                                <h4 className={styles.profileName}>
                                    {activeFriendProfile.first_name} {activeFriendProfile.last_name}
                                </h4>
                                <p className={styles.profileStatus}>
                                    {onlineUsers.includes(selectFriendId?.toString()) ? 'Active now' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        
                        <div className={styles.encryptionInfo}>
                            <div className={styles.encryptionBadge}>
                                <Lock size={12} />
                                <span>End-to-end encrypted</span>
                            </div>
                        </div>
                        
                        <div className={styles.profileActions}>
                            <button className={styles.actionButton}>
                                <CircleUserRound size={20} />
                                <span>Profile</span>
                            </button>
                            <button className={styles.actionButton}>
                                <BellRing size={20} />
                                <span>Mute</span>
                            </button>
                            <button className={styles.actionButton}>
                                <Search size={20} />
                                <span>Search</span>
                            </button>
                        </div>
                        
                        <div className={styles.profileSections}>
                            <details className={styles.profileSection}>
                                <summary className={styles.sectionHeader}>
                                    <span>Chat Info</span>
                                    <ChevronDown size={16} />
                                </summary>
                                <div className={styles.sectionContent}>
                                    {/* Chat info content */}
                                </div>
                            </details>
                            <details className={styles.profileSection}>
                                <summary className={styles.sectionHeader}>
                                    <span>Customize Chat</span>
                                    <ChevronDown size={16} />
                                </summary>
                                <div className={styles.sectionContent}>
                                </div>
                            </details>
                            <details className={styles.profileSection}>
                                <summary className={styles.sectionHeader}>
                                    <span>Media & Files</span>
                                    <ChevronDown size={16} />
                                </summary>
                                <div className={styles.sectionContent}>
                                </div>
                            </details>
                            <details className={styles.profileSection}>
                                <summary className={styles.sectionHeader}>
                                    <span>Privacy & Support</span>
                                    <ChevronDown size={16} />
                                </summary>
                                <div className={styles.sectionContent}>
                                </div>
                            </details>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messenger;