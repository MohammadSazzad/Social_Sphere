import { useEffect, useState } from "react";
import axios from "axios";
import { UserRoundPlus, EllipsisVertical, ChartNoAxesCombined, ArrowUpRight, CalendarDays, Bell } from "lucide-react";
import TitleProfile from "../../assets/TitleProfile.svg";
import styels from "./RightSideBar.module.css";

const RightSideBar = () => {

    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect( () => {
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

    console.log(users);
    console.log(events);

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{
            position: "fixed", 
            top: 60,
            right: 0, 
            width: "380px",
            height: "94vh", 
            overflowY: "auto",
        }}>
            <div>
                <span className="fs-4">Friend Suggestions</span>
                <button className="btn btn-light float-end">
                    <span className="p-1">See All</span> <ArrowUpRight size={25} className="p-1"/>
                </button>
            </div>
            <hr/>
            <ul className="list-group list-group-flush">
                {users.slice(0,5).map( (user) => (
                    <li key={user.id} className={`${styels.friendContainer}  list-group-item d-flex justify-content-between align-items-center`}>
                        <div type="button" className="d-flex align-items-center gap-2">
                            <img src={user.image || TitleProfile} alt="Profile" style={{"width": "32px", "height": "32px", "borderRadius": "50%"}} />
                            <p>{user.firstName + " " + user.lastName}</p>
                        </div>
                        <button className="btn btn-light"><UserRoundPlus /></button>
                    </li>
                ))}
            </ul>
            <hr />
            <div>
                <span className="fs-4">Profile Activity</span>
                <button className="btn btn-light float-end">
                    <EllipsisVertical size={20}/>
                </button>
            </div>
            <div className={`${styels.cardContainer} card mt-3`} style={{ width: "100%" }}>
                <div className="d-flex p-4 " style={{ position: "relative", height: "50px", paddingLeft: "20px", }}>
                    {Object.values(users).slice(0, 7).map((user, index) => (
                        <img
                            key={user.id}
                            src={user.image || TitleProfile}
                            alt="Profile"
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                position: "absolute",
                                left: `${index * 35+15}px`,
                                border: "2px solid white",
                                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                            }}
                        />
                    ))}
                </div>
                <div className="card-body">
                    <div className="d-flex gap-2 pt-4">
                        <h5 className="card-title"> +1,158 </h5>
                        <p>Followers</p>
                    </div>
                    <div className="d-flex gap-2">
                        <ChartNoAxesCombined size={20}/>
                        <p>23% vs last month</p>
                    </div>
                    <p className="card-text">
                        You gained a substaintial amount of followers this month.
                    </p>
                </div>
            </div>
            <div className="mt-3">
                <span className="fs-4">Upcoming Events</span>
                <button className="btn btn-light float-end">
                    <EllipsisVertical size={20}/>
                </button>
            </div>
            <hr />
            <ul className="list-group list-group-flush">
                {events.slice(0,5).map( (event) => (
                    <li key={event.id} className={`${styels.friendContainer}  list-group-item d-flex justify-content-between align-items-center`}>
                        <div type="button" className="d-flex align-items-center gap-2">
                        <CalendarDays />
                            <p>{event.title}</p>
                        </div>
                        <button className="btn btn-light"><Bell /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RightSideBar;