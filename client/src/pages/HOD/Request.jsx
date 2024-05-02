import React, { useState } from "react";
import { useEffect } from "react";
import RequestCard from "../../components/Request_Card1";
import axios from 'axios';

import classroom from '../../assets/classroom.svg'
import seminarhall from '../../assets/seminarhall.png'
import computerlab from '../../assets/computerlab.png'
import norequest from '../../assets/norequest.svg';


function Request() {

    const [data, setData] = useState([])

    const [classdata, setClassdata] = useState([])
    const [seminardata, setSeminardata] = useState([])
    const [labdata, setLabdata] = useState([])
    const Belongs_To="IT"
    const userData = JSON.parse(sessionStorage.getItem('userDetails'));
                if (!userData) {
                    // Handle case when user details are not available in sessionStorage
                    return;
                }
                const { userId,username, department} = userData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = { Belongs_To:department };
                const roomRes = await axios.post(`http://localhost:3001/hodrequests`, data);
                const labRes = await axios.post(`http://localhost:3001/hodlabrequests`, data);

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
    });

    const search = () => {
        const lay = document.getElementById("lay");
        const label = document.getElementById("label")
        lay.classList.add("border-4");
        lay.classList.add("border-gray-300");
        label.classList.remove("hidden")
        label.classList.add("label")



        setClassdata(data.filter((obj, _) => obj.type === 'Class Room'))
        setSeminardata(data.filter((obj, _) => obj.type === 'Seminar Hall'))
        setLabdata(data.filter((obj, _) => obj.type === 'Computer Lab'))

        
    }




    return (
        <>
            <div className="grid grid-flow-row justify-center items-center ">
                <div className="flex flex-row justify-center">
                    <h1 className="text-2xl md:text-3xl  font-bold">My Requests<span className="text-primary">.</span></h1>
                </div>
    
                <div className="mt-8">
                    {data.length > 0 ? (
                        data.map((object) => (
                            <div key={object.Room_Id}>
                                <RequestCard
                                    room={object.Room_Name}
                                    capacity={object.Student_capacity}
                                    computers={object.No_of_Computers}
                                    type={object.type}
                                    isOccupied={object.Occupied}
                                    belongsTo={object.Belongs_To}
                                    occupiedBy={object.Branch_Occupied}
                                    internet={object.Internet_Availbility}
                                    projector={object.Projector_Availbility}
                                    date={object.date}
                                    Requested_By={object.Requested_By}
                                    Purpose={object.Purpose}
                                    Day={object.Day}
                                    Timings={object.Timings}
                                    Room_Id={object.Room_Id}
                                />
                            </div>
                        ))
                    ) : (
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
    );
    
}

export default Request