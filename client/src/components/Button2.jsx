import React from "react";
import { Link } from "react-router-dom";

function Button1(props){
    return(
        
        <div  className={props.cls}>
         <Link className="bg-primary text-white py-2 px-5 rounded-2xl md:py-2   md:px-3" to={props.to}>{props.name}</Link>
        </div>
        
    )
}

export default Button1