import React, { useState } from "react";
import { useEffect } from "react";
import RequestCard from "../../components/Request_Card1";

import classroom from '../../assets/classroom.svg'
import seminarhall from '../../assets/seminarhall.png'
import computerlab from '../../assets/computerlab.png'


function Request() {

    const [data, setData] = useState([
        

        {
            room: 'RPLH-33',
            capacity: '200',
            computers: "0",
            type: "Seminar Hall",
            isOccupied: false,
            belongsTo: "IT",
            occupiedBy: null,
            internet: true,
            projector: true,
            isRequested: true
        },

        {
            room: 'CC Lab-03',
            capacity: '60',
            computers: "0",
            type: "Computer Lab",
            isOccupied: true,
            belongsTo: "IT",
            occupiedBy: "IT",
            internet: true,
            projector: true,
            isRequested: false
        },

        





    ])

    const [classdata, setClassdata] = useState([])
    const [seminardata, setSeminardata] = useState([])
    const [labdata, setLabdata] = useState([])

    useEffect(() => {
        
    }, [classdata, seminardata, labdata]);

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
                        {
                        data.map((object, _) =>
                                <div>
                                    <RequestCard room={object.room} capacity={object.capacity} computers={object.computers} type={object.type} isOccupied={object.isOccupied}
                                        belongsTo={object.belongsTo} occupiedBy={object.occupiedBy} internet={object.internet} projector={object.projector} isRequested={object.isRequested} />
                                </div>
                            )
                        }
                </div>

                
            </div>
        </>
    )
}

export default Request