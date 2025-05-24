import React, { useState } from "react";
import styles from "./profile.module.css";
import {
  FaEdit,
  FaPlusCircle,
  FaCamera,
  FaBriefcase,
  FaGraduationCap,
  FaHome,
  FaMapMarkerAlt,
  FaPhone,
  FaBirthdayCake,
  FaHeart,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail, BiShare } from "react-icons/bi";

const Profile = () => {
  const [bio, setBio] = useState("This is my bio...");
  const [editingBio, setEditingBio] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([
    { id: 1, content: "Hello world!", likes: 2, liked: false, comments: [] },
  ]);
  const [newPost, setNewPost] = useState("");
  const [about, setAbout] = useState({
    work: "Software Engineer at ABC Corp",
    school: "High School ABC",
    college: "XYZ College",
    university: "University of ABC",
    currentCity: "New York",
    hometown: "Los Angeles",
    phone: "+1 123 456 7890",
    instagram: "@myinstagram",
    twitter: "@mytwitter",
    gender: "Male",
    birthdate: "January 1, 2000",
    relationship: "Single",
  });

  const handlePost = () => {
    if (newPost.trim() === "") return;
    setPosts([
      { id: Date.now(), content: newPost, likes: 0, liked: false, comments: [] },
      ...posts,
    ]);
    setNewPost("");
  };

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleAboutChange = (field, value) => {
    setAbout((prev) => ({ ...prev, [field]: value }));
  };

  const handleBioSave = () => {
    setEditingBio(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.coverPhoto}>
        <button className={styles.changeCover}>
          <FaCamera /> Change Cover
        </button>
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.profilePic} aria-label="Profile picture"></div>
        <div className={styles.bioSection}>
          {editingBio ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={handleBioSave}
              autoFocus
              rows={2}
              className={styles.bioInput}
            />
          ) : (
            <p onClick={() => setEditingBio(true)} title="Click to edit bio">
              {bio}
            </p>
          )}
          <div className={styles.profileActions}>
            <button className={styles.editBtn}>
              <FaPlusCircle /> Create Story
            </button>
            <button
              className={styles.editBtn}
              onClick={() => setEditingProfile(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <h3>About</h3>
      {editingProfile ? (
        <div className={styles.aboutEdit}>
          <input
            type="text"
            value={about.work}
            onChange={(e) => handleAboutChange("work", e.target.value)}
            placeholder="Edit Work"
          />
          <input
            type="text"
            value={about.school}
            onChange={(e) => handleAboutChange("school", e.target.value)}
            placeholder="Edit School"
          />
          <input
            type="text"
            value={about.college}
            onChange={(e) => handleAboutChange("college", e.target.value)}
            placeholder="Edit College"
          />
          <input
            type="text"
            value={about.university}
            onChange={(e) => handleAboutChange("university", e.target.value)}
            placeholder="Edit University"
          />
          <input
            type="text"
            value={about.currentCity}
            onChange={(e) => handleAboutChange("currentCity", e.target.value)}
            placeholder="Edit Current City"
          />
          <button onClick={() => setEditingProfile(false)}>Save</button>
        </div>
      ) : (
        <>
          <div className={styles.aboutItem}>
            <FaBriefcase /> Work: {about.work}
          </div>
          <div className={styles.aboutItem}>
            <FaGraduationCap /> School: {about.school}
          </div>
          <div className={styles.aboutItem}>
            <FaGraduationCap /> College: {about.college}
          </div>
          <div className={styles.aboutItem}>
            <FaGraduationCap /> University: {about.university}
          </div>
          <div className={styles.aboutItem}>
            <FaMapMarkerAlt /> Current City: {about.currentCity}
          </div>
          <div className={styles.aboutItem}>
            <FaHome /> Hometown: {about.hometown}
          </div>
          <div className={styles.aboutItem}>
            <FaPhone /> Phone: {about.phone}
          </div>
          <div className={styles.aboutItem}>
            <FaBirthdayCake /> Birthdate: {about.birthdate}
          </div>
          <div className={styles.aboutItem}>
            <FaHeart /> Relationship: {about.relationship}
          </div>
        </>
      )}

      <div className={styles.profileTabs}>
        <button
          onClick={() => setActiveTab("posts")}
          className={activeTab === "posts" ? styles.activeTab : ""}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={activeTab === "photos" ? styles.activeTab : ""}
        >
          Photos
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={activeTab === "videos" ? styles.activeTab : ""}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={activeTab === "events" ? styles.activeTab : ""}
        >
          Events
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "posts" && (
          <>
            <div className={styles.createPost}>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button onClick={handlePost}>Post</button>
            </div>
            {posts.map((post) => (
              <div key={post.id} className={styles.post}>
                <div className={styles.postHeader}>
                  <span>User Name</span>
                  <BsThreeDots />
                </div>
                <p>{post.content}</p>
                <div className={styles.postActions}>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={post.liked ? styles.liked : ""}
                    aria-label={post.liked ? "Unlike" : "Like"}
                  >
                    <AiOutlineLike /> {post.likes}
                  </button>
                  <button>
                    <BiCommentDetail /> Comment
                  </button>
                  <button>
                    <BiShare /> Share
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        {activeTab === "photos" && <div>Photos Section</div>}
        {activeTab === "videos" && <div>Videos Section</div>}
        {activeTab === "events" && <div>Events Section</div>}
      </div>
    </div>
  );
};

export default Profile;