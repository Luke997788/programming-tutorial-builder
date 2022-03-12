import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";



function StudentHomepage() {
    let navigate = useNavigate();

    useEffect(() => {
        const status = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
    
        if (!status) {
          navigate("/login");
        }
    
        if (role == "teacher") {
          navigate("/home");
        }
    });

    function redirectToLogin(event) {
        event.preventDefault();

        navigate("/login")
    }

    return (
        <>
            <p>STUDENT HOME PAGE</p>
        </>

        
    );
}

export default StudentHomepage;