import { use, useEffect, useState } from "react";
import Context from "./Context";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const ContextProvider = ({children}) => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [stories, setStories] = useState([]);
    const [allStories, setAllStories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const { authUser } = useAuthStore();

    useEffect( () => {
        if(!authUser){
            return;
        }
        axiosInstance.get('/users/')
        .then( response => {
            setUsers(response.data.map ( (item) => ({
                id: item.id,
                firstName: item.first_name,
                lastName: item.last_name,
                email: item.email,
                gender : item.gender,
                dob: item.date_of_birth,
                profile: item.image,
                bio: item.bio,
                phoneNumber: item.phone_number,
                createdAt: item.created_at,
            })));
        })
        .catch( error => {
            console.log(error);
        })

    }, [authUser]) ;    

    useEffect( () => {
        if(!authUser){
            return;
        }
        axiosInstance.get('/events/upcoming/')
        .then( response => {
            setEvents(response.data.map ( (item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                organizer_id: item.organizer_id,
                group_id: item.group_id,
                location: item.location,
                start_date: item.start_date,
                end_date: item.end_date,
                created_at: item.created_at,
            })));
        })
        .catch( error => {
            console.log(error);
        })
    }, [authUser]) ;

    useEffect( () => {
        if(!authUser){
            return;
        }
        axiosInstance.get(`/stories/${authUser.id}`)
        .then( response => {
            setStories(response.data.map ( (item) => ({
                id: item.id,
                media_url: item.media_url,
                created_at: item.created_at,
                expires_at: item.expires_at,
                storyContent: item.storycontent,
                firstName: item.first_name,
                lastName: item.last_name,
                profilePicture: item.profile_picture_url,
            })));
        })
        .catch( error => {
            console.log(error);
        })
    }, [authUser]) ;

    useEffect( () => {
        if(!authUser){
            return;
        }
        axiosInstance.get('/stories/')
        .then( response => {
            setAllStories(response.data.map ( (item) => ({
                id: item.id,
                media_url: item.media_url,
                created_at: item.created_at,
                expires_at: item.expires_at,
                storyContent: item.storycontent,
                firstName: item.first_name,
                lastName: item.last_name,
                profilePicture: item.profile_picture_url,
            })));
        })
        .catch( error => {
            console.log(error);
        })
    }, [authUser]);

    useEffect ( () => {
        if(!authUser){
            return;
        }
        axiosInstance.get('/posts/')
        .then( response => {
            setPosts(response.data.map ( (item) => ({
                postId : item.post_id,
                profilePicture: item.profile_picture_url,
                firstName: item.first_name,
                lastName: item.last_name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                content: item.content,
                mediaUrl: item.media_url,
                reactionCount: item.reaction_count,
                commentCount: item.comment_count,
            })));
        })
        .catch( error => {
            console.log(error);
        })

    }, [authUser]);

    const formatTimeDifference = (isoString) => {
        const postDate = new Date(isoString);
        const now = new Date();
        const diff = now - postDate;
        
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
      
        if (diff < minute) {
          return 'Just now';
        } else if (diff < hour) {
          return `${Math.floor(diff/minute)}m ago`;
        } else if (diff < day) {
          return `${Math.floor(diff/hour)}h ago`;
        } else if (diff < day * 7) {
          return `${Math.floor(diff/day)}d ago`;
        }
        
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: diff > 31536000000 ? 'numeric' : undefined
        }).format(postDate);
      };

    console.log(posts);

    const context = {
        users,
        events,
        stories,
        posts,
        allStories,
        formatTimeDifference,
        searchTerm, 
        setSearchTerm,
        isSearchModalOpen,
        setIsSearchModalOpen,
    };

    console.log(users);

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );
}

export default ContextProvider;