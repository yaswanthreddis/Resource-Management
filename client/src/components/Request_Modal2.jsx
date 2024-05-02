import React, { useState } from 'react';
import classroom from '../assets/classroom.svg';
import computerlab from '../assets/computerlab.png';
import seminarhall from '../assets/seminarhall.png';
import axios from 'axios';
const Request_Modal2 = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [request, setRequest] = useState(false);
    const [res, setRes] = useState(false);
    const [resource,setResource] = useState([])
    const User_Id = 2;

    const handleRes = async () => {
        setRes(!res)
        try {
                
            const data = { User_Id,Building_Name: props.Building_Name,Weekday:props.Weekday,Slot: props.Slot,Lab_Id:props.Room_id }
            const res = await axios.post(`http://localhost:3001/resources`, data);
            if (res.data.success) {
                console.log(res.data.results)
                setResource(res.data.results);
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRequest = () => {
        setRequest(!request);
    }

    const handleChange1 = () => {
        setRequest(false)
    }

    const Approval_Status = "pending";

    const con = () => {
        const isConfirmed = window.confirm("Are you sure you want to confirm this request?");
    if (isConfirmed) {
      handleConfirm();
    }
    }
    const handleConfirm = async () => {

        /*
          Building_Name, Weekday, date, Slot, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id
        */




        try {
            // Building_Name,date, Slot, Lab_Id, Lab_Name, Purpose, Requested_By, Approval_Status, User_Id,Weekday
            const data = { Building_Name: props.Building_Name, Weekday: props.Weekday, date: props.date, Slot: props.Slot, Lab_Id: props.Room_id, Lab_Name: props.room, Purpose: purpose, Requested_By: props.Requested_By, Approval_Status: Approval_Status, User_Id: props.User_Id,Belongs_To:props.belongsTo }
            const res = await axios.post(`http://localhost:3001/requestlabs`, data);
            if (res.data.success) {
                
                props.updateData(res.data.results);


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





        setPurpose("")
        handleRequest()

    }

    const [purpose, setPurpose] = useState("")

    const handlePurpose = (event) => {
        setPurpose(event.target.value)
    }


    return (
        <div>
            <button onClick={openModal} className={props.isOccupied ? "occupied" : "notoccupied"}>
                {props.type === "Class Room" ? <img src={classroom} alt="classroom icon" className='w-8 h-8 inline mr-2' /> : props.type === "Computer Lab" ? <img src={computerlab} alt="classroom icon" className='w-8 h-8 inline mr-2' /> : <img src={seminarhall} alt="classroom icon" className='w-8 h-8 inline mr-2' />}{props.room}
            </button>
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto ">
                    <div className="flex items-center justify-center  pt-4 px-4  pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:w-96 w-80">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start justify-between">
                                    <div className="mt-3  sm:mt-0 sm:text-left max-h-80  overflow-y-auto  w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {props.type === "Class Room" ? <img src={classroom} alt="classroom icon" className='w-10 h-10 inline mr-2' /> : props.type === "Computer Lab" ? <img src={computerlab} alt="classroom icon" className='w-10 h-10 inline mr-2' /> : <img src={seminarhall} alt="classroom icon" className='w-10 h-10 inline mr-2' />}{props.room}
                                        </h3>
                                        <div className={request || res ? "hidden" : "mt-2"}>
                                            <div className="grid grid-cols-2 gap-2 ">
                                                <p className="text-sm text-gray-900">Capacity:</p>
                                                <p className="text-sm text-black pl-3">{props.capacity}</p>
                                                <p className="text-sm text-gray-900">No. of Computers:</p>
                                                <p className="text-sm text-black pl-3">{props.computers}</p>
                                                <p className="text-sm text-gray-900">Type:</p>
                                                <p className="text-sm text-black pl-3">{props.type}</p>
                                                <p className="text-sm text-gray-900">Occupied:</p>
                                                <p className="text-sm text-black pl-3">{props.isOccupied ? "Yes" : "No"}</p>
                                                <p className="text-sm text-gray-900">Belongs To:</p>
                                                <p className="text-sm text-black pl-3">{props.belongsTo}</p>
                                                <p className="text-sm text-gray-900">Occupied By:</p>
                                                <p className="text-sm text-black pl-3">{props.isOccupied ? props.occupiedBy : "None"}</p>
                                                <p className="text-sm text-gray-900">Internet:</p>
                                                <p className="text-sm text-black pl-3">{props.internet ? "Yes" : "No"}</p>
                                                <p className="text-sm text-gray-900">Projector:</p>
                                                <p className="text-sm text-black pl-3">{props.projector ? "Yes" : "No"}</p>
                                                <p className="text-sm text-gray-900">Subject:</p>
                                                <p className="text-sm text-black pl-3">{props.subject}</p>
                                            </div>
                                        </div>
                                        <div className={res ? "mt-2" : "hidden"}>
                                            <div className="grid grid-cols-2 gap-2">
                                                {
                                                    resource.map((object, i) =>
                                                        <>
                                                            <p className="text-sm text-gray-900">{object.Resource_Name}:</p>
                                                            <p className="text-sm text-black pl-3">{object.Resource_Count}</p>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => { closeModal(); handleChange1(); }}
                                            type="button"
                                            className="text-gray-400 hover:text-black focus:outline-none focus:text-black"
                                        >
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className={request ? "" : "hidden"}>

                                    {/* Text area */}

                                    <textarea placeholder="Type your reason here" value={purpose} onChange={handlePurpose} className="mt-8 p-2 outline outline-gray-300 focus:outline-none focus:border-2 focus:border-primary block w-full rounded-md"></textarea>
                                    {/* Confirm and cancel buttons */}
                                </div>
                                <div className="mt-5  md:mx-0 sm:mt-4 flex justify-end">
                                    <div className={request ? "hidden" : ""}>
                                        <button
                                            className={
                                                " inline-flex justify-center rounded-md border-2 border-primary shadow-sm px-4 py-2 mr-2 bg-primary text-base font-medium text-white  focus:outline-none   sm:ml-3 sm:w-auto sm:text-sm "}
                                            
                                            onClick={handleRes}>
                                            {res ? "Back" : "Resources"}
                                        </button>
                                    </div>
                                    <div className={request | res ? "hidden" : ""}>


                                        <button
                                            className={props.isRequested ? "inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-300  text-base font-medium text-slate-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                : " inline-flex justify-center rounded-md border-2 border-primary shadow-sm px-4 py-2 bg-primary text-base font-medium text-white  focus:outline-none   sm:ml-3 sm:w-auto sm:text-sm "}
                                            disabled={props.isRequested}
                                            onClick={handleRequest}>
                                            {props.isRequested ? "Requested" : "Request"}
                                        </button>


                                    </div>
                                    <div className={request ? "" : "hidden"}>
                                        <button
                                            className=
                                            " inline-flex justify-center rounded-md border-2 border-primary shadow-sm px-4 py-2 bg-primary text-base font-medium text-white  focus:outline-none   sm:ml-3 sm:w-auto sm:text-sm "
                                            onClick={con}
                                        >
                                            Confirm
                                        </button>

                                        <button
                                            className=
                                            " inline-flex justify-center rounded-md  border-2 shadow-sm px-4 py-2  border-primary text-base font-medium text-primary  focus:outline-none   ml-3 sm:w-auto sm:text-sm "
                                            onClick={handleRequest}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Request_Modal2;
