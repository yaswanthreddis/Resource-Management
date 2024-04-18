import React from "react";
import classroom from '../assets/classroom.svg'
import seminarhall from '../assets/seminarhall.png'
import computerlab from '../assets/computerlab.png'
import axios from 'axios';
function RequestCard(props) {


  const confirmCancel = () => {
    const isConfirmed = window.confirm("Are you sure you want to cancel?");
    if (isConfirmed) {
      handleCancel();
    }
  };

  const handleCancel = async () =>{
    try {
              
      const data = {User_Id:props.User_Id,Request_Id:props.request_id}
      const res = await axios.post(`http://localhost:3001/cancelrequest`, data);
      if (res.data.success) {
          console.log(res.data.result);
          props.handleUpdate(res.data.result);

          
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
  return (
    <div className="relative bg-white rounded-lg shadow-2xl p-4 mb-4 md:w-100">
      <div className="mb-2">
        <h2 className="text-xl font-semibold">{props.type === "Class Room" ? <img src={classroom} alt="classroom icon" className='w-10 h-10 inline mr-2' /> : props.type==="Computer Lab" ? <img src={computerlab} alt="classroom icon" className='w-10 h-10 inline mr-2' /> : <img src={seminarhall} alt="classroom icon" className='w-10 h-10 inline mr-2' />}{props.room}</h2>
    
      </div>
      <div>
        <p className="text-gray-700 mb-2"></p>
        <div className= "mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-md text-gray-900">Capacity:</p>
                        <p className="text-md text-black pl-3">{props.capacity}</p>
                        <p className="text-md text-gray-900">No. of Computers:</p>
                        <p className="text-md text-black pl-3">{props.computers}</p>
                        <p className="text-md text-gray-900">Type:</p>
                        <p className="text-md text-black pl-3">{props.type}</p>
                        <p className="text-md text-gray-900">Occupied:</p>
                        <p className="text-md text-black pl-3">{props.isOccupied ? "Yes" : "No"}</p>
                        <p className="text-md text-gray-900">Belongs To:</p>
                        <p className="text-md text-black pl-3">{props.belongsTo}</p>
                        <p className="text-md text-gray-900">Occupied By:</p>
                        <p className="text-md text-black pl-3">{props.isOccupied ? props.occupiedBy : "None"}</p>
                        <p className="text-md text-gray-900">Internet:</p>
                        <p className="text-md text-black pl-3">{props.internet ? "Yes" : "No"}</p>
                        <p className="text-md text-gray-900">Projector:</p>
                        <p className="text-md text-black pl-3">{props.projector ? "Yes" : "No"}</p>
                        <p className="text-md text-gray-900">Status:</p>
                        <p className="text-md text-black pl-3">Pending</p>
                      </div>
        </div>
        
        <div className="mt-2 flex justify-end">
        <button
          onClick={confirmCancel}
          className="bg-red-500 text-white py-2 px-4 rounded-lg text-md  focus:outline-none hover:bg-red-600"

        >
          Cancel Request
        </button>
        </div>
      </div>
    </div>
  );
}

export default RequestCard;
