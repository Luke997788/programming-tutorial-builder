import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewsubmission.css';

class ViewAssignments extends Component {

  state = {

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

        this.retrieveStudentAssignmentInformation();
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

    async retrieveStudentAssignmentInformation() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecificstudentassignmentsubmission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId: sessionStorage.getItem("studentId"), assignmentId: sessionStorage.getItem("assignmentId")}),
        });
    
        await response.json().then(data => {
            var submissionContainer = document.getElementById("student-assignment-container");
    
            var submission = data[0];

            submissionContainer.innerHTML = submission;
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{sessionStorage.getItem("studentFirstName") + ' ' + sessionStorage.getItem("studentLastName") + ' (' + sessionStorage.getItem("studentId") + ')'}</h1>
      
      <div id="student-assignment-container">

      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
	return <ViewAssignments navigate={navigate} />;
}