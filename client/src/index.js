import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Layout from './pages/teacher/Layout';
import LoginForm from './pages/login/LoginForm';
import MainPage from './pages/login/MainPage';
import Homepage from './pages/teacher/home/Homepage';
import CreateCourse from './pages/teacher/createcourse/CreateCourse';
import MyCourses from './pages/teacher/courses/MyCourses';
import EditCourse from './pages/teacher/courses/EditCourse';
import EditCourseDetails from './pages/teacher/courses/EditCourseDetails';
import SelectContentType from './pages/teacher/courses/SelectContentType';
import ViewCourse from './pages/teacher/courses/ViewCourse'
import MyStudents from './pages/teacher/mystudents/MyStudents';
import ViewClass from './pages/teacher/mystudents/ViewClass';
import AddTextImageContent from './pages/teacher/content/AddTextImageContent';
import EditTextImageContent from './pages/teacher/content/EditTextImageContent';
import AddVideoContent from './pages/teacher/content/AddVideoContent';
import EditVideoContent from './pages/teacher/content/EditVideoContent';
import AddExerciseContent from './pages/teacher/content/AddExerciseContent';
import EditExerciseContent from './pages/teacher/content/EditExerciseContent';

import StudentLayout from './pages/student/StudentLayout';
import StudentHomepage from './pages/student/StudentHomepage';
import StudentMyCourses from './pages/student/StudentMyCourses';
import StudentMyFeedback from './pages/student/StudentMyFeedback';
import StudentViewCourse from './pages/student/StudentViewCourse'


function App() {

    return (
        <>
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

                    <Route path="/editcourse/addtextimage" element={<AddTextImageContent />} />
                    <Route path="/editcourse/edittextimage" element={<EditTextImageContent />} />
                    <Route path="/editcourse/addvideo" element={<AddVideoContent />} />
                    <Route path="/editcourse/editvideo" element={<EditVideoContent />} />
                    <Route path="/editcourse/addexercise" element={<AddExerciseContent />} />
                    <Route path="/editcourse/editexercise" element={<EditExerciseContent />} />
                    <Route path="/mystudents" element={<MyStudents />} />
                    <Route path="/mystudents/viewclass" element={<ViewClass />} />
                </Route>
                <Route path="/" element={<StudentLayout />} >
                    <Route path="/studenthome" element={<StudentHomepage />} />
                    <Route path="/studentmycourses" element={<StudentMyCourses />} />
                    <Route path="/studentviewcourse" element={<StudentViewCourse />} />
                    <Route path="/studentmyfeedback" element={<StudentMyFeedback />} />
                </Route>
            </Routes>
        </BrowserRouter>        
        </>
    );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));