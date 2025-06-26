import { useContext } from "react";
import Context from "../../store/Context";
import styles from './SearchResultsList.module.css'; // Create this CSS module
import title from '../../assets/TitleProfile.svg';

const SearchResultsList = () => {
    const { users, searchTerm, setselectFriendId} = useContext(Context);

    if (!searchTerm || searchTerm.trim() === "") return null;

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
 

    return (
        <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
            <h5>Search Results</h5>
        </div>
        
        <div className={styles.resultsBody}>
            {filteredUsers.length === 0 ? (
            <div className={styles.noResults}>
                <p>No users found for "{searchTerm}"</p>
                <small>Try different keywords</small>
            </div>
            ) : (
            <div className='mt-1 mb-1' style={{
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                }}>
                {filteredUsers.map(user => (
                <div 
                    key={user.id} 
                    className={styles.resultItem}
                    onClick={() => setselectFriendId(user.id)}
                >
                    <div className={styles.userInfo}>
                    <img 
                        src={user.profile_picture_url || title} 
                        alt={`${user.first_name} ${user.last_name}`}
                        className={styles.avatar}
                        width={40}
                        height={40}
                    />
                    <div className={styles.userDetails}>
                        <h6 className={styles.userName}>
                        {user.firstName} {user.lastName}
                        </h6>
                        {user.username && (
                        <small className={styles.userHandle}>
                            @{user.username}
                        </small>
                        )}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
};

export default SearchResultsList;