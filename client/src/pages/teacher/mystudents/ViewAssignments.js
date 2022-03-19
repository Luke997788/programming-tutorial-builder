import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

class ViewAssignments extends Component {

  state = {
    classId: '',
    studentId: '',
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
      let { classid, studentid } = this.props.params;
      this.setState({classId: classid});
      this.setState({studentId: studentid});
  
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
        } else if (data[2] != this.state.classId) {
          this.props.navigate("/mystudents");
        }

        this.setState({firstName: data[0]});
        this.setState({lastName: data[1]});
      })
    }

    async retrieveStudentAssignmentInformation() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getstudentassignmentsubmissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId: this.state.studentId}),
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
            viewButton.onclick = () => {this.props.navigate("/mystudents/viewassignments/viewsubmission/" + this.state.studentId + "/" + assignmentId)};
      
            cell3.appendChild(viewButton);
    
            rowCount += 1;
          }
        })
      }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{this.state.firstName + ' ' + this.state.lastName + ' (' + this.state.studentId + ')'}</h1>
      
      <div id="student-assignments-container">
        <table id="assignments-information-table">
          <tr>
            <th>Course Id</th>
            <th>Assignment Id</th>
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

	return <ViewAssignments navigate={navigate} params={params}/>;
}