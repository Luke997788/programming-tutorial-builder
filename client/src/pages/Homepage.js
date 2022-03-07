import React, { useEffect } from 'react';
import './homepage.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from './Layout';
import CreateCourse from './CreateCourse';
import MyCourses from './MyCourses';
import MyStudents from './MyStudents';

function Homepage() {
  //let username = sessionStorage.getItem("username");
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
    {/*<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Homepage />} />
          <Route path="createacourse" element={<CreateCourse />} />
          <Route path="mycourses" element={<MyCourses />} />
          <Route path="mystudents" element={<MyStudents />} />
        </Route>
      </Routes>
    </BrowserRouter> */}

    <p>Homepage</p>
    {/*<p id="username">{username}</p>*/}
    </>
  );
}

export default Homepage;

//ReactDOM.render(<Homepage />, document.getElementById('root'));
