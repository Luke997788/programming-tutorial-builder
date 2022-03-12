import React, { useEffect } from 'react';
//import './homepage.css';
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');

    if (!status) {
      navigate("/login");
    }

    if (role == "student") {
      navigate("/studenthome");
    }
  });

  return (
    <>
    <p>Homepage</p>
    </>
  );
}

export default Homepage;

