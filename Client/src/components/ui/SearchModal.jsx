import { useContext } from "react";
import Context from "../../store/Context";
import styles from "./SearchModal.module.css";

const SearchModal = () => {
  const { 
    users, 
    searchTerm, 
    isSearchModalOpen,
    setIsSearchModalOpen 
  } = useContext(Context);

  if (!isSearchModalOpen) return null;
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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Search Results</h5>
          <button 
            type="button" 
            className={styles.closeButton}
            onClick={() => setIsSearchModalOpen(false)}
          >
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {filteredUsers.length === 0 ? (
            <div className={styles.noResults}>
              <p>No users found for "{searchTerm}"</p>
              <small>Try different keywords</small>
            </div>
          ) : (
            <div className={styles.resultsList}>
              {filteredUsers.map(user => (
                <a 
                  key={user.id} 
                  href={`/profile/${user.id}`}
                  className={styles.resultItem}
                >
                  <div className={styles.userInfo}>
                    <img 
                      src={user.avatar || "/default-avatar.png"} 
                      alt={`${user.firstName} ${user.lastName}`}
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
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div 
        className={styles.modalBackdrop}
        onClick={() => setIsSearchModalOpen(false)}
      ></div>
    </div>
  );
};

export default SearchModal;