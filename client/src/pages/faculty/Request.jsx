import React, { useState } from "react";
import { useEffect } from "react";
import RequestCard from "../../components/Request_Card";
import axios from 'axios';
import classroom from '../../assets/classroom.svg'
import seminarhall from '../../assets/seminarhall.png'
import computerlab from '../../assets/computerlab.png'
import norequest from '../../assets/norequest.svg';

function Request() {

   
    const userData = JSON.parse(sessionStorage.getItem('userDetails'));
                if (!userData) {
                    // Handle case when user details are not available in sessionStorage
                    return;
                }
                const { userId,username, department} = userData;
    const [data, setData] = useState([])
    const handleUpdate = (newData) => {
        setData(newData);
    };
    



    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = { User_Id:userId };
                const roomRes = await axios.post(`http://localhost:3001/myrequests`, data);
                const labRes = await axios.post(`http://localhost:3001/mylabrequests`, data);
                if (roomRes.data.success || labRes.data.success) {
                    const allRequests = [...roomRes.data.results, ...labRes.data.results];
                    console.log(allRequests);
                    setData(allRequests);
                    
                } else {
                    // fetch failed
                    setData([]) // corrected response object name
                }
            } catch (error) {
                console.error('Error fetching', error);
                alert('An error occurred while fetching. Please try again.');
            }
        };

        fetchData();
    }, []);









    return (
        <>
            <div className="grid grid-flow-row justify-center items-center ">
                <div className="flex flex-row justify-center">
                    <h1 className="text-2xl md:text-3xl  font-bold">My Requests<span className="text-primary">.</span></h1>
                </div>

                <div className="mt-8">
                    {data.length > 0 ? (
                        data.map((object, i) =>
                            <div key={i}>
                                <RequestCard 
                                room={object.Room_Name} 
                                capacity={object.Student_capacity} 
                                computers={object.No_of_Computers} 
                                type={object.Room_Type} 
                                isOccupied={object.Occupied}
                                belongsTo={object.Belongs_To} 
                                occupiedBy={object.Branch_Occupied} 
                                internet={object.Internet_Availbility} 
                                projector={object.Projector_Availbility} 
                                date={object.date} 
                                timings={object.Timings} 
                                request_id={object.Request_Id} 
                                handleUpdate = {handleUpdate} 
                                User_Id={userId}
                            />
                        </div>
                    )
                ):(
                    <div>
                    <div>
                    <img src={norequest} alt="No requests found" />
                    </div>
                    <div>
                                            <h1 className="text-2xl md:text-3xl  ">No Requests Right Now<span className="text-primary">.</span></h1>
                    </div>
                    </div>
                )}
            </div>


            </div>
        </>
    )
}

export default Request