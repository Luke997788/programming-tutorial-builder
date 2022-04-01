import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './viewsubmission.css';

class StudentViewAssignments extends Component {

  state = {
    studentId: '',
    assignmentId: '',
  };

  componentDidMount() {
		const status = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "teacher") {
			this.props.navigate("/home");
		}

        this.retrieveStudentAssignmentInformation().then(data => {
            this.retrieveAssignmentFeedback();
        });
	}

  componentDidUpdate() {
		const status = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "teacher") {
			this.props.navigate("/home");
		}

        if (role == "teacher") {

        }
    }

    async retrieveStudentAssignmentInformation() {
        let { assignmentid } = this.props.params;
        this.setState({assignmentId: assignmentid});

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecificstudentassignmentsubmission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId: sessionStorage.getItem("studentId"), assignmentId: assignmentid}),
        });
    
        await response.json().then(data => {
          if (data[0] == 'failed') {
            this.props.navigate("/studentmyfeedback");
          }
          
            var assignmentTitle = document.getElementById("assignment-title");
            var courseTitle = document.getElementById("course-title");
            var submissionContainer = document.getElementById("student-assignment-container");
    
            var courseName = data[0];
            var assignmentName = data[1]
            var submission = data[2];

            assignmentTitle.innerHTML = "Assignment Title: " + assignmentName;
            courseTitle.innerHTML = "Submission for: " + courseName;
            submissionContainer.innerHTML = submission;
        })
      }

      async retrieveAssignmentFeedback() {
        let { assignmentid } = this.props.params;
        this.setState({assignmentId: assignmentid});

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getteacherfeedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId: sessionStorage.getItem("studentId"), assignmentId: assignmentid}),
        });
    
        await response.text().then(data => {
          if (data == 'failed') {
            document.getElementById("teacher-feedback-container").innerHTML = 'Awaiting feedback from your course instructor';
          } else {
            var feedback = data;
            document.getElementById("teacher-feedback-container").innerHTML = feedback;
          }
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1 id="assignment-title"></h1>
      <h4 id="course-title"></h4>
      <h4 id="student-information"></h4>
      
      <div id="student-assignment-container"></div>

      <h4 id="feedback-title">Assignment Feedback</h4>
      <div id="teacher-feedback-container"></div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();

	return <StudentViewAssignments navigate={navigate} params={params}/>;
}