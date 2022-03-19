import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './viewsubmission.css';

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

        this.setState({firstName: data[0]});
        this.setState({lastName: data[1]});
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
          
            var submissionContainer = document.getElementById("student-assignment-container");
    
            var submission = data[0];

            submissionContainer.innerHTML = submission;
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{this.state.firstName + ' ' + this.state.lastName + ' (' + this.state.studentId + ')'}</h1>
      
      <div id="student-assignment-container">

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