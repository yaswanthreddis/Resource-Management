import React, { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import Request from '../../components/Request_Modal2.jsx'
import classroom from '../../assets/classroom.svg'
import seminarhall from '../../assets/seminarhall.png'
import computerlab from '../../assets/computerlab.png' 


function Lab() {

    const [data, setData] = useState([])
    
    const [buildingdata,setbuildingdata]=useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`http://localhost:3001/buildings`);
                if (res.data.success) {
                    console.log(res.data.result);
                    setbuildingdata(res.data.result)
                    
                } else {
                    // fetch failed
                    alert(res.data.message); // corrected response object name
                }
            } catch (error) {
                console.error('Error fetching', error);
                alert('An error occurred while fetching. Please try again.');
            }

            
        };

        fetchData();
    }, []);

    const User_Id = 2;
    const userData = JSON.parse(sessionStorage.getItem('userDetails'));
                if (!userData) {
                    // Handle case when user details are not available in sessionStorage
                    return;
                }
                const { userId,username, department} = userData;

    const [seminardata, setSeminardata] = useState([])
    const [labdata, setLabdata] = useState([])


    const search = async () => {
        const lay = document.getElementById("lay");
        const label = document.getElementById("label")
        lay.classList.add("border-4");
        lay.classList.add("border-gray-300");
        label.classList.remove("hidden")
        label.classList.add("label")

        

            try {
                
                const data = { User_Id:userId,Building_Name,Weekdayy, Slot }
                const res = await axios.post(`http://localhost:3001/searchlabs`, data);
                console.log(res.data.results)
                if (res.data.success) {
                    setData(res.data.results);
                    


                    
                    
                }
                else {
                    // fetch failed
                    alert(response.data.message);
                }
            }
            catch (error) {
                console.error('Error fetching', error);
                alert('An error occurred while fecthing. Please try again.');
            };
        
    }

    useEffect(() => {
                    setSeminardata(data.filter((obj) => obj.Type_ === 'Seminar Hall'));
                    setLabdata(data.filter((obj) => obj.Type_ === 'Computer Lab'  || obj.Type_ === 'Hardware Lab'));
                    console.log(seminardata);
                    console.log(labdata);
    } , [data]);

    const [date,setDate] = useState(new Date().toISOString().split('T')[0])
    const [Slot,setTime] = useState("S7")
    const [Building_Name,setBuilding] = useState("Research Park")
    const selectedDate = new Date(date);
    const options = { weekday: 'long' };
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', options);

    const [Weekdayy, setDay] = useState(dayOfWeek)

    const handleDate = (event) => {
        setDate(event.target.value);
        const selectedDate = new Date(event.target.value);
        const options = { weekday: 'long' };
        const dayOfWeek = selectedDate.toLocaleDateString('en-US', options);
        setDay(dayOfWeek);
    }

    const handleTime = (event) => {
        setTime(event.target.value);
        
    }

    const handleBuilding = (event) => {
        setBuilding(event.target.value);
        
    }

    const Requested_By = username

    const updateData = (updatedData) => {
        setData(updatedData);
    
        
        
    };
      
    


    


    return (
        <>
            <div className="grid grid-flow-row justify-center items-center ">
                <div className="flex flex-row justify-center">
                    <h1 className="text-2xl md:text-3xl  font-bold">Lab and Hall Info<span className="text-primary">.</span></h1>
                </div>

                <div className="mt-6 md:flex md:flex-row md: gap-10">
                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Building:</span><br />
                        </div>
                        <div>
                        <select name="type" value={Building_Name} onChange={handleBuilding} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-40 h-9 focus:outline-primary text-gray-400 focus:text-primary ">
                                {buildingdata.map((building, index) => (
                                    <option key={index} value={building.Building_name} selected={Building_Name === building.Building_name}>{building.Building_name}</option>
                                ))}
                            </select>
                        </div>

                    </div>


                    


                    


                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Date:</span><br />
                        </div>
                        <div>
                            <input type="date" value = {date} onChange={handleDate}  min={new Date().toISOString().split('T')[0]} className='py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-40 h-9 focus:outline-primary text-gray-400 focus:text-primary' />

                        </div>
                    </div >

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Time:</span><br />
                        </div>
                        <div>
                            <select name="type" defaultValue="S7" onChange={handleTime} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-40 h-9 focus:outline-primary text-gray-400 focus:text-primary">
                                <option value="S7" selected={Slot === "S7"}>7:30  - 10:00</option>
                                <option value="S8" selected={Slot === "S8"}>10:30  - 01:00</option>
                                <option value="S9" selected={Slot === "S9"}>02:00  - 04:30</option>
                            </select>
                        </div>
                    </div >





                    <div className="md:py-4 py-2">
                        <div className="md:pb-3 font-medium">
                            <span ></span><br />
                        </div>
                        <div className="md:mt-1">
                            <span className="button1 bg-primary text-white py-2 px-5 rounded-lg  pb-2 cursor-pointer " onClick={search} >Search</span>

                        </div>



                    </div>


                </div>


            </div>

            <div className="flex justify-center items-center mb-8 flex-col" >
                <div className=" hidden" id="label">

                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="p-1 px-2  rounded bg-primary border-2 border-primary">

                            </div>
                            <div className="ml-2 text-sm">
                                Occupied
                            </div>
                        </div>

                        <div className="mt-4 flex flex-row">
                            <div className="p-1 px-2 rounded bg-white border-2 border-primary">

                            </div>
                            <div className="ml-2 text-sm">
                                Not Occupied
                            </div>
                        </div>

                    </div>


                    <div className="md:ml-14 mt-8 md:mt-0 flex flex-col">

                        <div className="mt-4 flex flex-row">
                            <div className="">
                                <img src={seminarhall} alt="classroom icon" className='w-6 h-6 inline ' />
                            </div>
                            <div className="ml-2 text-sm">
                                Seminar Hall
                            </div>
                        </div>
                        <div className="mt-4 flex flex-row">
                            <div className="">
                                <img src={computerlab} alt="classroom icon" className='w-6 h-6 inline ' />
                            </div>
                            <div className="ml-2 text-sm">
                                Computer Lab
                            </div>
                        </div>

                    </div>



                </div>
                <div id="lay" className="p-5 mt-6 rounded-md md:w-110 w-80 grid justify-center">

                   
                    <div className=" mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {


                            seminardata.map((object, i) =>
                                <div key={i}>
                                    <Request room={object.Lab_Name} capacity={object.Student_Capacity} computers={object.No_of_Computers} type={object.Type_} isOccupied={object.Occupied}
                                        belongsTo={object.Belongs_To} occupiedBy={object.Branch_Occupied}  projector={object.Projector} isRequested={object.Requested} internet={object.Internet} 
                                        Building_Name={Building_Name} Weekday={Weekdayy} Slot={Slot} Room_id={object.Lab_Id} Requested_By = {Requested_By} date={date} User_Id={userId} updateData={updateData} subject = {object.Subject_}
                                         />
                                </div>
                            )
                        }
                    </div>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {


                            
                            
                            labdata.map((object, i) =>
                                <div key={i}>
                                    <Request room={object.Lab_Name} capacity={object.Student_Capacity} computers={object.No_of_Computers} type={object.Type_} isOccupied={object.Occupied}
                                        belongsTo={object.Belongs_To} occupiedBy={object.Branch_Occupied}  projector={object.Projector} isRequested={object.Requested} internet={object.Internet} 
                                        Building_Name={Building_Name} Weekday={Weekdayy} Slot={Slot} Room_id={object.Lab_Id} Requested_By = {Requested_By} date={date} User_Id={userId} updateData={updateData} subject = {object.Subject_}
                                         />
                                </div>
                            )
                        }
                    </div>


                </div>
            </div>
        </>
    )
}

export default Lab