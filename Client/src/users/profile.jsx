import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./profile.module.css";
import CoverPlaceholder from "../assets/Logo.png";
import ProfilePlaceholder from "../assets/Logo.png";

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user:", userId);
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                console.log("User data:", data);
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, [userId]);
    
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.coverPhoto}>
                <img src={user.coverPhoto || CoverPlaceholder} alt="Cover" />
            </div>
            <div className={styles.profileDetails}>
                <img className={styles.profileImage} src={user.profilePicture || ProfilePlaceholder} alt="Profile" />
                <h2>{user.name}</h2>
                <p>{user.bio || "No bio available"}</p>
            </div>
            <div className={styles.postsSection}>
                <h3>Posts</h3>
                {user.posts?.length > 0 ? (
                    user.posts.map((post) => (
                        <div key={post.id} className={styles.post}>
                            <p>{post.content}</p>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
