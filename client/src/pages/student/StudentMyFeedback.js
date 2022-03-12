import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";



function StudentMyFeedback() {
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

    return (
        <>
            <p>STUDENT MY FEEDBACK</p>
        </>

        
    );
}

export default StudentMyFeedback;