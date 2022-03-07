import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";



function MainPage() {
    let navigate = useNavigate();

    useEffect(() => {
        const status = sessionStorage.getItem('username');
    
        if (status) {
          navigate("/home");
        }
    });

    function redirectToLogin(event) {
        event.preventDefault();

        navigate("/login")
    }

    return (
        <>
            <button onClick={redirectToLogin}>Login</button>
            <p>MAIN PAGE</p>
        </>

        
    );
}

export default MainPage;