import React from "react";
import { Link } from "react-router-dom";

function Button1(props){
    return(
        
        <div className="button1">
         <Link className="bg-primary text-white py-2 px-5 rounded-lg  pb-2 " to={props.to}>{props.name}</Link>
        </div>
        
    )
}

export default Button1