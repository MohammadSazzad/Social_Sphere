import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./profile.module.css";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${userId}`,
          { withCredentials: true }
        );

        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.coverSection}>
        <img
          src={user.cover_picture_url || "/assets/profileCover/default.jpg"}
          alt="Cover"
          className={styles.coverImg}
        />
        <img
          src={user.profile_picture_url || "/assets/person/default.jpg"}
          alt="Profile"
          className={styles.profileImg}
        />
      </div>

      <div className={styles.profileDetails}>
        <div className={styles.headerRow}>
          <h2 className={styles.username}>{user.username}</h2>
          <button className={styles.followBtn}>Follow</button>
        </div>

        <p className={styles.bio}>{user.bio || "This user has no bio yet."}</p>

        <div className={styles.additionalInfo}>
          {user.location && <p><strong>Location:</strong> {user.location}</p>}
          {user.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a href={user.website} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </p>
          )}
          {/* Add more fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
