import { useContext } from "react";
import { UserRoundPlus, EllipsisVertical, ChartNoAxesCombined, ArrowUpRight, CalendarDays, Bell } from "lucide-react";
import TitleProfile from "../../assets/TitleProfile.svg";
import styels from "./RightSideBar.module.css";
import Context from "../../store/Context";

const RightSideBar = () => {

    const { users, events } = useContext(Context);

    return (
        <div className={`d-flex flex-column flex-shrink-0 p-3 bg-light ${styels.rightSidebar}`} style={{
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