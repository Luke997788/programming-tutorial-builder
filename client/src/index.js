import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import './index.css';
import Layout from './pages/Layout';
import LoginForm from './pages/LoginForm';
import MainPage from './pages/MainPage';
import Homepage from './pages/Homepage';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import EditCourse from './pages/EditCourse';
import EditCourseDetails from './pages/EditCourseDetails';
import SelectContentType from './pages/SelectContentType';
import AddContent from './pages/AddContent';
import ViewCourse from './pages/ViewCourse'
import MyStudents from './pages/MyStudents';
import ViewClass from './pages/ViewClass';

import Tiny from './pages/Tiny';
import AddTextImageContent from './pages/AddTextImageContent';
import EditTextImageContent from './pages/EditTextImageContent';

import StudentLayout from './pages/StudentLayout';
import StudentHomepage from './pages/StudentHomepage';
import StudentMyCourses from './pages/StudentMyCourses';
import StudentMyFeedback from './pages/StudentMyFeedback';


function App() {

    return (
        <>
        {/*<BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<LoginForm /> } />
                    <Route path="home" element={<Homepage />} />
                    <Route path="createacourse" element={<CreateCourse />} />
                    <Route path="mycourses" element={<MyCourses />} />
                    <Route path="mystudents" element={<MyStudents />} />
                </Route>
            </Routes>
        </BrowserRouter>*/}

        {/*<BrowserRouter>
            <Routes>
                <Route index element={<LoginForm /> } />
                <Route path="/" element={<Layout />} >
                    <Route path="login" element={<LoginForm />} />
                    <Route path="home" element={<Homepage />} />
                    <Route path="createacourse" element={<CreateCourse />} />
                    <Route path="mycourses" element={<MyCourses />} />
                    <Route path="mystudents" element={<MyStudents />} />
                </Route>
            </Routes>
        </BrowserRouter>*/}


        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<Layout />} >
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/createacourse" element={<CreateCourse />} />
                    <Route path="/mycourses" element={<MyCourses />} />
                    <Route path="/viewcourse" element={<ViewCourse />} />
                    <Route path="/editcourse" element={<EditCourse />} />
                    <Route path="/editcoursedetails" element={<EditCourseDetails />} />
                    <Route path="/editcourse/selectcontent" element={<SelectContentType />} />
                    <Route path="/editcourse/addcontent" element={<AddContent />} />
                    <Route path="/tiny" element={<Tiny />} />
                    <Route path="/editcourse/addtextimage" element={<AddTextImageContent />} />
                    <Route path="/editcourse/edittextimage" element={<EditTextImageContent />} />
                    <Route path="/mystudents" element={<MyStudents />} />
                    <Route path="/mystudents/viewclass" element={<ViewClass />} />
                </Route>
                <Route path="/" element={<StudentLayout />} >
                    <Route path="/studenthome" element={<StudentHomepage />} />
                    <Route path="/studentmycourses" element={<StudentMyCourses />} />
                    <Route path="/studentmyfeedback" element={<StudentMyFeedback />} />
                </Route>
            </Routes>
        </BrowserRouter>        

        {/*<BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<Layout />} >
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/createacourse" element={<CreateCourse />} />
                    <Route path="/mycourses" element={<MyCourses />} />
                    <Route path="/mystudents" element={<MyStudents />} />
                </Route>
            </Routes>
        </BrowserRouter>*/}
        </>

        
    );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<LoginForm />, document.getElementById('root'));