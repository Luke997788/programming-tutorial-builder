import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './studentmycourses.css';

class StudentMyCourses extends Component {

  componentDidMount() {
		const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "teacher") {
			this.props.navigate("/home");
		}

    this.retrieveStudentCourse();
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

  async retrieveStudentCourse() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getstudentcourses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({studentId: sessionStorage.getItem("studentId")}),
    });

    await response.json().then(data => {
      document.getElementById("title").innerHTML = "My Courses (" + data[0][3] + ")";
      var table = document.getElementById("student-course-info-table");
      var rowCount = 1;
  
      for(let i=0; i < data.length; i++) {
        let courseId = data[i][0];
        let courseTitle = data[i][1];
        let courseDescription = data[i][2];
  
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
  
        cell1.innerHTML = courseTitle;
        cell2.innerHTML = courseDescription;
  
        var viewButton = document.createElement("button");
        viewButton.setAttribute("class", "courseViewButton");
        viewButton.setAttribute("value", courseId);
        viewButton.innerHTML = "View";
        viewButton.onclick = () => {this.props.navigate("/studentviewcourse/" + courseId)};
  
        cell3.appendChild(viewButton);
  
        rowCount += 1;
      }
    });
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1 id="title"></h1> 

      <div id="student-course-info-container">
        <table id="student-course-info-table">
          <tr>
            <th>Course Title</th>
            <th>Course Description</th>
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
	return <StudentMyCourses navigate={navigate} />;
}