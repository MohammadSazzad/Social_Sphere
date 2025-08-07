import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./profile.module.css";
import { FaEdit, FaCamera, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaHome, FaPhone, FaBirthdayCake, FaHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail, BiShare } from "react-icons/bi";

const Profile = () => {
  const { userId } = useParams();
  const [bio, setBio] = useState("Loading...");
  const [editingBio, setEditingBio] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, content: "Hello world!", likes: 2, liked: false, comments: [] },
  ]);
  const [about, setAbout] = useState({
    work: "Loading...",
    school: "Loading...",
    college: "Loading...",
    university: "Loading...",
    currentCity: "Loading...",
    hometown: "Loading...",
    phone: "Loading...",
    birthdate: "Loading...",
    relationship: "Loading...",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        const user = res.data;

        setBio(user.bio || "This is my bio...");
        setAbout({
          work: user.work,
          school: user.school,
          college: user.college,
          university: user.university,
          currentCity: user.currentCity,
          hometown: user.hometown,
          phone: user.phone,
          birthdate: user.birthdate,
          relationship: user.relationship,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleBioSave = async () => {
    try {
      await axios.put(`/api/users/${userId}/bio`, { bio });
      setEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleAboutSave = async () => {
    try {
      await axios.put(`/api/users/${userId}/about`, about);
      setEditingAbout(false);
    } catch (error) {
      console.error("Error updating about info:", error);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.coverWrapper}>
        <div className={styles.coverImg}></div>
        <button className={styles.changeCover}><FaCamera /> Change Cover</button>
        <div className={styles.profileInfo}>
          <div className={styles.profileImg}></div>
          <div>
            <h1>User Name</h1>
            {editingBio ? (
              <textarea
                className={styles.bioInput}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={handleBioSave}
                autoFocus
              />
            ) : (
              <p onClick={() => setEditingBio(true)}>{bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tabNav}>
        {['posts', 'photos', 'videos', 'about'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'posts' && (
          <>
            <div className={styles.createPost}>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button onClick={() => setPosts([{ id: Date.now(), content: newPost, likes: 0, liked: false, comments: [] }, ...posts])}>Post</button>
            </div>
            {posts.map(post => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span>User Name</span>
                  <BsThreeDots />
                </div>
                <p>{post.content}</p>
                <div className={styles.postActions}>
                  <button onClick={() => {}} className={post.liked ? styles.liked : ""}>
                    <AiOutlineLike /> {post.likes}
                  </button>
                  <button><BiCommentDetail /> Comment</button>
                  <button><BiShare /> Share</button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'about' && (
          <div>
            <h4>About Info</h4>
            {editingAbout ? (
              <>
                <p><FaBriefcase /> Work: <input value={about.work} onChange={(e) => setAbout({ ...about, work: e.target.value })} /></p>
                <p><FaGraduationCap /> School: <input value={about.school} onChange={(e) => setAbout({ ...about, school: e.target.value })} /></p>
                <p><FaGraduationCap /> College: <input value={about.college} onChange={(e) => setAbout({ ...about, college: e.target.value })} /></p>
                <p><FaGraduationCap /> University: <input value={about.university} onChange={(e) => setAbout({ ...about, university: e.target.value })} /></p>
                <p><FaMapMarkerAlt /> Current City: <input value={about.currentCity} onChange={(e) => setAbout({ ...about, currentCity: e.target.value })} /></p>
                <p><FaHome /> Hometown: <input value={about.hometown} onChange={(e) => setAbout({ ...about, hometown: e.target.value })} /></p>
                <p><FaPhone /> Phone: <input value={about.phone} onChange={(e) => setAbout({ ...about, phone: e.target.value })} /></p>
                <p><FaBirthdayCake /> Birthdate: <input type="date" value={about.birthdate} onChange={(e) => setAbout({ ...about, birthdate: e.target.value })} /></p>
                <p><FaHeart /> Relationship: <select value={about.relationship} onChange={(e) => setAbout({ ...about, relationship: e.target.value })}>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                </select></p>
                <button onClick={handleAboutSave}>Save</button>
              </>
            ) : (
              <>
                <p><FaBriefcase /> Work: {about.work}</p>
                <p><FaGraduationCap /> School: {about.school}</p>
                <p><FaGraduationCap /> College: {about.college}</p>
                <p><FaGraduationCap /> University: {about.university}</p>
                <p><FaMapMarkerAlt /> Current City: {about.currentCity}</p>
                <p><FaHome /> Hometown: {about.hometown}</p>
                <p><FaPhone /> Phone: {about.phone}</p>
                <p><FaBirthdayCake /> Birthdate: {about.birthdate}</p>
                <p><FaHeart /> Relationship: {about.relationship}</p>
                <button onClick={() => setEditingAbout(true)}><FaEdit /> Edit</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;