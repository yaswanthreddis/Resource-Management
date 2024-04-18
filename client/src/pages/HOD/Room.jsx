import React, { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import Request from '../../components/Request_Modal1.jsx'
import classroom from '../../assets/classroom.svg'
import seminarhall from '../../assets/seminarhall.png'
import computerlab from '../../assets/computerlab.png' 


function Room() {

    const [data, setData] = useState([])

    const User_Id = 1;
    const [classdata, setClassdata] = useState([])
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
                
                const data = { User_Id,Building_Name,date,Weekdayy, Slot }
                const res = await axios.post(`http://localhost:3001/searchrooms`, data);
                if (res.data.success) {
                    setData(res.data.results);


                    setClassdata(res.data.results.filter((obj) => obj.Room_Type === 'Class Room'));
                    setSeminardata(res.data.results.filter((obj) => obj.Room_Type === 'Seminar Hall'));
                    setLabdata(res.data.results.filter((obj) => obj.Room_Type === 'Computer Lab'));
                    
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

    const [date,setDate] = useState(new Date().toISOString().split('T')[0])
    const [Slot,setTime] = useState("S1")
    const Building_Name = "Research Park"
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

    

    const Requested_By = "KSR"

    const updateData = (updatedData) => {
        setData(updatedData);
    
        setClassdata(prevData => updatedData.filter((obj) => obj.Room_Type === 'Class Room'))
        setSeminardata(prevData => updatedData.filter((obj) => obj.Room_Type === 'Seminar Hall'))
        setLabdata(prevData => updatedData.filter((obj) => obj.Room_Type === 'Computer Lab'))        
    };
      
    




    return (
        <>
            <div className="grid grid-flow-row justify-center items-center ">
                <div className="flex flex-row justify-center">
                    <h1 className="text-2xl md:text-3xl  font-bold">Room Info<span className="text-primary">.</span></h1>
                </div>

                <div className="mt-6 md:flex md:flex-row md: gap-10">



                    


                    


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
                            <select name="type" defaultValue="S1" onChange={handleTime} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-40 h-9 focus:outline-primary text-gray-400 focus:text-primary">
                                <option value="S1" selected={Slot === "S1"}>7:30  - 8:20</option>
                                <option value="S2" selected={Slot === "S2"}>8:20  - 9:10</option>
                                <option value="S3" selected={Slot === "S3"}>9:10  - 10:00</option>
                                <option value="S4" selected={Slot === "S4"}>10:30 - 11:20</option>
                                <option value="S5" selected={Slot === "S5"}>11:20 - 12:10</option>
                                <option value="S6" selected={Slot === "S6"}>12:10 - 1:00</option>
                            </select>
                        </div>
                    </div >





                    <div className="md:py-4 py-2">
                        <div className="md:pb-3 font-medium">
                            <span ></span><br />
                        </div>
                        <div className="md:mt-1">
                            <span className="button1 bg-primary text-white py-2 px-5 rounded-lg  pb-2 " onClick={search} >Search</span>

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
                        <div className="flex flex-row">
                            <div className="">
                                <img src={classroom} alt="classroom icon" className='w-6 h-6 inline ' />
                            </div>
                            <div className="ml-2 text-sm">
                                Class Room
                            </div>
                        </div>

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
                <div id="lay" className="p-5 mt-6 rounded-md md:w-100 w-80 grid justify-center">

                    <div className="flex flex-wrap  gap-4">
                        {

                            
                            classdata.map((object, i )=>
                                <div key={i}>
                                    <Request room={object.Room_Name} capacity={object.Student_Capacity} computers={object.No_of_Computers} type={object.Room_Type} isOccupied={object.Occupied}
                                        belongsTo={object.Belongs_To} occupiedBy={object.Branch_Occupied} internet={object.Internet_Availbility} projector={object.Projector_Availbility} isRequested={object.Requested} 
                                        Building_Name={Building_Name} Weekday={Weekdayy} Slot={Slot} Room_id={object.Room_Id} Requested_By = {Requested_By} date={date} User_Id={User_Id} updateData={updateData}
                                         />
                                </div>
                            )
                        }



                    </div>

                    <div className=" mt-8 flex flex-wrap gap-4">
                        {


                            seminardata.map((object, i) =>
                                <div key={i}>
                                    <Request room={object.Room_Name} capacity={object.Student_Capacity} computers={object.No_of_Computers} type={object.Room_Type} isOccupied={object.Occupied}
                                        belongsTo={object.Belongs_To} occupiedBy={object.Branch_Occupied} internet={object.Internet_Availbility} projector={object.Projector_Availbility} isRequested={object.Requested} 
                                        Building_Name={Building_Name} Weekday={Weekdayy} Slot={Slot} Room_id={object.Room_Id} Requested_By = {Requested_By} date={date} User_Id={User_Id} updateData={updateData}
                                         />
                                </div>
                            )
                        }
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {


                            
                            labdata.map((object, i) =>
                                <div key={i}>
                                    <Request room={object.Room_Name} capacity={object.Student_Capacity} computers={object.No_of_Computers} type={object.Room_Type} isOccupied={object.Occupied}
                                        belongsTo={object.Belongs_To} occupiedBy={object.Branch_Occupied} internet={object.Internet_Availbility} projector={object.Projector_Availbility} isRequested={object.Requested} 
                                        Building_Name={Building_Name} Weekday={Weekdayy} Slot={Slot} Room_id={object.Room_Id} Requested_By = {Requested_By} date={date} User_Id={User_Id} updateData={updateData}
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

export default Room