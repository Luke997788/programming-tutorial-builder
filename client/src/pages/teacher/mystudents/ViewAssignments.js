import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

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
    
            var courseId = data[i][0];
            var assignmentId = data[i][1];
            var submission = data[i][2];
      
            cell1.innerHTML = courseId;
            cell2.innerHTML = assignmentId;

            var viewButton = document.createElement("button");
            viewButton.innerHTML = "View Submission";
            viewButton.onclick = () => {sessionStorage.setItem("assignmentId", assignmentId); this.props.navigate("/mystudents/viewassignments/viewsubmission")};
      
            cell3.appendChild(viewButton);
    
            rowCount += 1;
          }
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{sessionStorage.getItem("studentFirstName") + ' ' + sessionStorage.getItem("studentLastName") + ' (' + sessionStorage.getItem("studentId") + ')'}</h1>
      
      <div id="student-assignments-container">
        <table id="assignments-information-table">
          <tr>
            <th>Course Id</th>
            <th>Assignment Id</th>
            <th></th>
          </tr>
        </table>
      </div>

      {/*<iframe src="https://www.orimi.com/pdf-test.pdf" width="500px" height="800px"></iframe>*/}
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
	return <ViewAssignments navigate={navigate} />;
}