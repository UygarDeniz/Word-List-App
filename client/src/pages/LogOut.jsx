import React from "react";
import { Navigate } from "react-router-dom";

function LogOut() {
    if(localStorage.getItem("token")){
        localStorage.removeItem("token");
    }
    return <Navigate to="/login" />;
}

export default LogOut;