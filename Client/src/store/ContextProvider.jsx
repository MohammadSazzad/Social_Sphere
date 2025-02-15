import { useEffect, useState } from "react";
import Context from "./Context";
import axios from "axios";

const ContextProvider = ({children}) => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);

    const isToken = localStorage.getItem('token');

    useEffect( () => {
        if(!isToken){
            return;
        }
        axios.get('/api/users/')
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

    }, []) ;    

    useEffect( () => {
        if(!isToken){
            return;
        }
        axios.get('/api/events/upcoming/')
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
    }, []) ;
    const context = {
        users,
        events,
    };

    console.log(users);

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );
}

export default ContextProvider;