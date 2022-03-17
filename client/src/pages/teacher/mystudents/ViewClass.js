import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
//import './homepage.css';
//import './mycourses.css';

class ViewClass extends Component {

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

    this.retrieveStudentInformation();
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
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getclassstudents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classId: sessionStorage.getItem("classId")}),
    });

    await response.json().then(data => {
      var table = document.getElementById("student-info-table");

      var rowCount = 1;
      for(let i=0; i < data.length; i++) {
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        var studentId = data[i][0];
        var firstName = data[i][1];
        var lastName = data[i][2];
  
        cell1.innerHTML = studentId;
        cell2.innerHTML = firstName;
        cell3.innerHTML = lastName;

        var viewButton = document.createElement("button");
        viewButton.setAttribute("class", "assignmentsViewButton");
        viewButton.innerHTML = "View Assignments";
        viewButton.onclick = () => {sessionStorage.setItem("studentId", studentId); sessionStorage.setItem("studentFirstName", firstName); sessionStorage.setItem("studentLastName", lastName); this.props.navigate("/mystudents/viewassignments")};
  
        cell4.appendChild(viewButton);

        rowCount += 1;
      }
    })
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{sessionStorage.getItem("classId")} Students</h1> 

      <div id="student-info-container">
        <table id="student-info-table">
          <tr>
            <th>Student Id</th>
            <th>First Name</th>
            <th>Surname</th>
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
	return <ViewClass navigate={navigate} />;
}