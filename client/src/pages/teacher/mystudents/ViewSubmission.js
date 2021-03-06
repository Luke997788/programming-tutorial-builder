import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './viewsubmission.css';
import FeedbackEditor from './FeedbackEditor';

class ViewAssignments extends Component {

  state = {
    studentId: '',
    assignmentId: '',
    firstName: '',
    lastName: '',
  };

  componentDidMount() {
		const status = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}

    this.retrieveStudentInformation().then(data => {
      this.retrieveStudentAssignmentInformation();
    });
	}

  componentDidUpdate() {
		const status = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}

        if (role == "teacher") {

        }
    }

    async retrieveStudentInformation() {
      let { assignmentid, studentid } = this.props.params;
      this.setState({studentId: studentid});
      this.setState({assignmentId: assignmentid});
  
      // starts a request, passes URL and configuration object
      const response = await fetch('/api/getspecificstudentinformation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: studentid}),
      });
  
      await response.json().then(data => {
        if (data[0] == 'failed') {
          this.props.navigate("/mystudents");
        }

        var firstName = data[0];
        var lastName = data[1];

        document.getElementById("student-information").innerHTML = "Submitted by: " + firstName + " " + lastName + " " + "(" + this.state.studentId + ")";
      })
    }

    async retrieveStudentAssignmentInformation() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecificstudentassignmentsubmission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId: this.state.studentId, assignmentId: this.state.assignmentId}),
        });
    
        await response.json().then(data => {
          if (data[0] == 'failed') {
            this.props.navigate("/mystudents");
          }
          
            var assignmentTitle = document.getElementById("assignment-title");
            var courseTitle = document.getElementById("course-title");
            var submissionContainer = document.getElementById("student-assignment-container");
    
            var courseName = data[0];
            var assignmentName = data[1]
            var submission = data[2];

            assignmentTitle.innerHTML = assignmentName;
            courseTitle.innerHTML = "Submission for: " + courseName;
            submissionContainer.innerHTML = submission;
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1 id="assignment-title"></h1>
      <h4 id="course-title"></h4>
      <h4 id="student-information"></h4>
      
      <div id="student-assignment-container">

      </div>

      <div id="feedback-editor">
        <FeedbackEditor />
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();

	return <ViewAssignments navigate={navigate} params={params}/>;
}