import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import './index.css';

import Layout from './pages/teacher/Layout';
import LoginForm from './pages/login/LoginForm';
import MainPage from './pages/login/MainPage';
import Homepage from './pages/teacher/home/Homepage';
import CreateCourse from './pages/teacher/createcourse/CreateCourse';
import MyCourses from './pages/teacher/courses/MyCourses';
import EditCourse from './pages/teacher/courses/EditCourse';
import EditCourseDetails from './pages/teacher/courses/EditCourseDetails';
import EditContentOrder from './pages/teacher/courses/EditContentOrder';
import SelectContentType from './pages/teacher/courses/SelectContentType';
import ViewCourse from './pages/teacher/courses/ViewCourse'
import MyStudents from './pages/teacher/mystudents/MyStudents';
import ViewClass from './pages/teacher/mystudents/ViewClass';
import ViewAssignments from './pages/teacher/mystudents/ViewAssignments';
import ViewSubmission from './pages/teacher/mystudents/ViewSubmission';
import AddTextImageContent from './pages/teacher/content/AddTextImageContent';
import EditTextImageContent from './pages/teacher/content/EditTextImageContent';
import AddVideoContent from './pages/teacher/content/AddVideoContent';
import EditVideoContent from './pages/teacher/content/EditVideoContent';
import AddMultipleChoiceExerciseContent from './pages/teacher/content/AddMultipleChoiceExerciseContent';
import EditMultipleChoiceExerciseContent from './pages/teacher/content/EditMultipleChoiceExerciseContent';
import AddFillInGapExerciseContent from './pages/teacher/content/AddFillInGapExerciseContent';
import EditFillInGapExerciseContent from './pages/teacher/content/EditFillInGapExerciseContent';
import AddMatchingExercise from './pages/teacher/content/AddMatchingExercise';
import EditMatchingExercise from './pages/teacher/content/EditMatchingExercise';
import AddTest from './pages/teacher/content/AddTest';
import EditTest from './pages/teacher/content/EditTest';
import AddAssignment from './pages/teacher/content/AddAssignment';
import EditAssignment from './pages/teacher/content/EditAssignment';

import StudentLayout from './pages/student/StudentLayout';
import StudentHomepage from './pages/student/StudentHomepage';
import StudentMyCourses from './pages/student/StudentMyCourses';
import StudentMyFeedback from './pages/student/StudentMyFeedback';
import StudentViewSubmission from './pages/student/StudentViewSubmission'
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
                    <Route path="/viewcourse/:id" element={<ViewCourse />} />
                    <Route path="/editcourse/:id" element={<EditCourse />} />
                    <Route path="/editcoursedetails/:id" element={<EditCourseDetails />} />
                    <Route path="/editcourse/:id/editcontentorder" element={<EditContentOrder />} />
                    <Route path="/editcourse/:id/selectcontent" element={<SelectContentType />} />

                    <Route path="/editcourse/:id/addtextimage" element={<AddTextImageContent />} />
                    <Route path="/editcourse/:id/edittextimage/:contentid" element={<EditTextImageContent />} />

                    <Route path="/editcourse/:id/addvideo" element={<AddVideoContent />} />
                    <Route path="/editcourse/:id/editvideo/:contentid" element={<EditVideoContent />} />

                    <Route path="/editcourse/:id/addchoiceexercise" element={<AddMultipleChoiceExerciseContent />} />
                    <Route path="/editcourse/:id/:testid/addchoiceexercise" element={<AddMultipleChoiceExerciseContent />} />
                    <Route path="/editcourse/:id/editchoiceexercise/:contentid" element={<EditMultipleChoiceExerciseContent />} />
                    <Route path="/editcourse/:id/editchoiceexercise/:testid/:contentid" element={<EditMultipleChoiceExerciseContent />} />

                    <Route path="/editcourse/:id/addgapexercise" element={<AddFillInGapExerciseContent />} />
                    <Route path="/editcourse/:id/:testid/addgapexercise" element={<AddFillInGapExerciseContent />} />
                    <Route path="/editcourse/:id/editgapexercise/:contentid" element={<EditFillInGapExerciseContent />} />
                    <Route path="/editcourse/:id/editgapexercise/:testid/:contentid" element={<EditFillInGapExerciseContent />} />

                    <Route path="/editcourse/:id/addmatchingexercise" element={<AddMatchingExercise />} />
                    <Route path="/editcourse/:id/:testid/addmatchingexercise" element={<AddMatchingExercise />} />
                    <Route path="/editcourse/:id/editmatchingexercise/:contentid" element={<EditMatchingExercise />} />
                    <Route path="/editcourse/:id/editmatchingexercise/:testid/:contentid" element={<EditMatchingExercise />} />

                    <Route path="/editcourse/:id/addtest" element={<AddTest />} />
                    <Route path="/editcourse/:id/edittest/:contentid" element={<EditTest />} />

                    <Route path="/editcourse/:id/addassignment" element={<AddAssignment />} />
                    <Route path="/editcourse/:id/editassignment/:contentid" element={<EditAssignment />} />

                    <Route path="/mystudents" element={<MyStudents />} />
                    <Route path="/mystudents/viewclass/:id" element={<ViewClass />} />
                    <Route path="/mystudents/viewassignments/:classid/:studentid" element={<ViewAssignments />} />
                    <Route path="/mystudents/viewassignments/viewsubmission/:studentid/:assignmentid" element={<ViewSubmission />} />
                </Route>
                <Route path="/" element={<StudentLayout />} >
                    <Route path="/studenthome" element={<StudentHomepage />} />
                    <Route path="/studentmycourses" element={<StudentMyCourses />} />
                    <Route path="/studentviewcourse/:id" element={<StudentViewCourse />} />
                    <Route path="/studentmyfeedback" element={<StudentMyFeedback />} />
                    <Route path="/studentmyfeedback/viewsubmission/:assignmentid" element={<StudentViewSubmission />} />
                </Route>
            </Routes>
        </BrowserRouter>        
        </>
    );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));