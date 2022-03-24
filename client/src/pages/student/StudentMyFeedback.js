import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

class StudentMyFeedback extends Component {

  state = {
    classId: '',
    studentId: '',
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

    this.retrieveStudentAssignmentInformation();
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
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getstudentassignmentsubmissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId: sessionStorage.getItem("studentId")}),
        });
    
        await response.json().then(data => {
          var table = document.getElementById("assignments-information-table");
    
          var rowCount = 1;
          for(let i=0; i < data.length; i++) {
            var row = table.insertRow(rowCount);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
    
            var courseTitle = data[i][0];
            var contentTitle = data[i][1];
            var assignmentId = data[i][2];
      
            cell1.innerHTML = courseTitle;
            cell2.innerHTML = contentTitle;

            var viewButton = document.createElement("button");
            viewButton.innerHTML = "View Submission";
            viewButton.onclick = () => {this.props.navigate("/studentmyfeedback/viewsubmission/" + assignmentId)};
      
            cell3.appendChild(viewButton);
    
            rowCount += 1;
          }
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>My Feedback</h1>
      
      <div id="student-assignments-container">
        <table id="assignments-information-table">
          <tr>
            <th>Course Title</th>
            <th>Assignment Title</th>
            <th></th>
          </tr>
        </table>
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();

	return <StudentMyFeedback navigate={navigate} params={params}/>;
}