import React, { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';



function Resource() {

    const [data, setData] = useState([])
    const [buildingdata, setbuildingdata] = useState([])

    /*useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`http://localhost:3001/buildings`);
                if (res.data.success) {
                    console.log(res.data.results);
                    setbuildingdata(res.data.results)
                    
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
    */



    const handleAddBuilding = () => {
        const isConfirmed = window.confirm(" You want to add this Building ?");
        if (isConfirmed) {
            addBuilding();
        }
    }

    const addBuilding = async () => {




        /* try {
             
             const data = { Building_Name,floors }
             const res = await axios.post(`http://localhost:3001/searchrooms`, data);
             if (res.data.success) {
                 alert("Building Added Sucessfully")   
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

         */


        setBuildingName("")
        setFloors("")






    }



    const handleAddRoom = () => {
        const isConfirmed = window.confirm(" You want to add this Room ?");
        if (isConfirmed) {
            addRoom();
        }
    }

    const addRoom = async () => {




        /* try {
             
             const data = { room,Building_Name1,capacity,projector,internet,computer,belongs,type }
             const res = await axios.post(`http://localhost:3001/searchrooms`, data);
             if (res.data.success) {
                 alert("Room Added Sucessfully")   
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

         */


        setRoom("")
        setBuildingName1("Research Park")
        setCapacity("")
        setProjector("Yes")
        setInternet("Yes")
        setComputer("")
        setBelongs("CSE")
        setType("Class Room")






    }


    const [Building_Name, setBuildingName] = useState("")

    const handleBuilding = (event) => {
        setBuildingName(event.target.value)
    }

    const [floors, setFloors] = useState("")

    const handleFloors = (event) => {
        setFloors(event.target.value)
    }



    const [room, setRoom] = useState("")

    const handleRoom = (event) => {
        setRoom(event.target.value)
    }

    const [Building_Name1, setBuildingName1] = useState("Research Park")

    const handleBuilding1 = (event) => {
        setBuildingName1(event.target.value)
    }

    const [capacity, setCapacity] = useState("")

    const handleCapacity = (event) => {
        setCapacity(event.target.value)
    }


    const [projector, setProjector] = useState("Yes")

    const handleProjector = (event) => {
        setProjector(event.target.value)
    }

    const [internet, setInternet] = useState("Yes")

    const handleInternet = (event) => {
        setInternet(event.target.value)
    }

    const [computer, setComputer] = useState("")

    const handleComputer = (event) => {
        setComputer(event.target.value)
    }


    const [belongs, setBelongs] = useState("CSE")

    const handleBelongs = (event) => {
        setBelongs(event.target.value)
    }

    const [type, setType] = useState("Class Room")

    const handleType = (event) => {
        setType(event.target.value)
    }


    const [showBuildingForm, setShowBuildingForm] = useState(true);
    const [showRoomForm, setShowRoomForm] = useState(false);

    const handleRadioChange = (event) => {
        if (event.target.value === "building") {
            setShowBuildingForm(true);
            setShowRoomForm(false);
        } else if (event.target.value === "room") {
            setShowBuildingForm(false);
            setShowRoomForm(true);
        }
    };









    return (
        <>
            <div className="grid grid-flow-row justify-center items-center ">
                <div className="flex flex-row justify-center">
                    <h1 className="text-2xl md:text-3xl  font-bold">Add Resource<span className="text-primary">.</span></h1>
                </div>

                
                
                <div className="mt-6 flex justify-center gap-4">
                    <div>
                        <input type="radio" name="add" value="building" checked={showBuildingForm} onChange={handleRadioChange} />
                        <span>Add Building</span>
                    </div>
                    <div>
                        <input type="radio" name="add" value="room" checked={showRoomForm} onChange={handleRadioChange} />
                        <span>Add Room</span>
                    </div>
                </div>

                {showBuildingForm && (

                <div className="mt-6 md:flex md:flex-col ">
                    <div className="py-4">
                        <div className="pb-3 font-medium">
                            <span>Building Name:</span><br />
                        </div>
                        <div>
                            <input placeholder="Building Name" name="Building_Name" type="text" value={Building_Name} onChange={handleBuilding} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary " />

                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>No. of Floors:</span><br />
                        </div>
                        <div>
                            <input placeholder="No. of floors" name="Building_Name" type="number" value={floors} onChange={handleFloors} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary " />

                        </div>

                    </div>



                    <div className="md:py-4 py-2 mt-6">

                        <div className="">
                            <span className="button1 bg-primary text-white py-2 px-5 rounded-lg  pb-2 cursor-pointer" onClick={handleAddBuilding} >Add Building</span>

                        </div>



                    </div>




                </div>

                )}


                {showRoomForm && (
                <div className="mt-6 md:flex md:flex-col ">
                    <div className="py-4">
                        <div className="pb-3 font-medium">
                            <span>Room Name:</span><br />
                        </div>
                        <div>
                            <input placeholder="Room Name" name="Room_Name" type="text" value={room} onChange={handleRoom} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary " />

                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Building:</span><br />
                        </div>
                        <div>
                            <select name="type" value={Building_Name1} onChange={handleBuilding1} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary ">
                                <option value="Research Park" selected={Building_Name1 === "Research Park"} >Research Park</option>
                                <option value="Main Building" selected={Building_Name1 === "Main Building"}>Main Building</option>
                                <option value="Civil Mechnical Block" selected={Building_Name1 === "Civil Mechnical Block"}>Civil Mechnical Block</option>
                            </select>
                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Student Capacity:</span><br />
                        </div>
                        <div>
                            <input placeholder="Student Capacity" name="Student_Capacity" type="number" value={capacity} onChange={handleCapacity} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary " />
                        </div>

                    </div>


                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Projector Availbility:</span><br />
                        </div>
                        <div>
                            <select name="type" value={projector} onChange={handleProjector} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary ">
                                <option value="Yes" selected={projector === "Yes"} >Yes</option>
                                <option value="No" selected={projector === "No"}>No</option>
                            </select>
                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Internet Availbility:</span><br />
                        </div>
                        <div>
                            <select name="type" value={internet} onChange={handleInternet} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary ">
                                <option value="Yes" selected={internet === "Yes"} >Yes</option>
                                <option value="No" selected={internet === "No"}>No</option>
                            </select>
                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>No. of Computers:</span><br />
                        </div>
                        <div>
                            <input placeholder="No. of Computers" name="No_of_Computers" type="number" value={computer} onChange={handleComputer} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary " />
                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Belongs To:</span><br />
                        </div>
                        <div>
                            <select name="type" value={belongs} onChange={handleBelongs} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary ">
                                <option value="CSE" selected={belongs === "CSE"} >CSE</option>
                                <option value="IT" selected={belongs === "IT"}>IT</option>
                                <option value="CB" selected={belongs === "CB"}>CB</option>
                                <option value="AIML" selected={belongs === "AIML"}>AIML</option>
                                <option value="ECE" selected={belongs === "CB"}>ECE</option>
                                <option value="EEE" selected={belongs === "EEE"}>EEE</option>
                                <option value="CIVIL" selected={belongs === "CIVIL"}>CIVIL</option>
                                <option value="MECH" selected={belongs === "MECH"}>MECH</option>
                            </select>
                        </div>

                    </div>

                    <div className="py-4"> {/*username*/}
                        <div className="pb-3 font-medium">
                            <span>Room Type:</span><br />
                        </div>
                        <div>
                            <select name="type" value={type} onChange={handleType} className="py-2 outline outline-gray-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-gray-300 w-48 md:w-64 h-9 focus:outline-primary text-gray-400 focus:text-primary ">
                                <option value="Class Room" selected={type === "Class Room"} >Class Room</option>
                                <option value="Computer Lab" selected={type === "IT"}>Computer Lab</option>
                                <option value="Seminar Hall" selected={type === "Seminar Hall"}>Seminar Hall</option>

                            </select>
                        </div>

                    </div>



                    <div className="md:py-4 py-2 mt-6 mb-4">

                        <div className="">
                            <span className="button1 bg-primary text-white py-2 px-5 rounded-lg  pb-2 cursor-pointer" onClick={handleAddRoom} >Add Room</span>

                        </div>



                    </div>




                </div>
                )}

            </div>







        </>
    )
}

export default Resource