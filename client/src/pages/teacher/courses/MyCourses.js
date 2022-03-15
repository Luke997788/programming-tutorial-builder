import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './mycourses.css';

class MyCourses extends Component {

  componentDidMount() {
		const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}

    this.displayCourses();
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

  async displayCourses() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getcourseinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username")}),
    });

    await response.json().then(data => {      
      var table = document.getElementById("course-info-table");
      var rowCount = 1;
  
      for(let i=0; i < data.length; i++) {
        let courseId = data[i][0];
        let courseTitle = data[i][1];
        let courseDescription = data[i][2];
        let targetClass = data[i][3];
  
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
  
        cell1.innerHTML = courseTitle;
        cell2.innerHTML = courseDescription;
        cell3.innerHTML = targetClass;
  
        var editButton = document.createElement("button");
        editButton.setAttribute("class", "courseEditButton");
        editButton.setAttribute("value", courseId);
        editButton.innerHTML = "Edit";
        editButton.onclick = () => {sessionStorage.setItem("courseId", courseId); sessionStorage.setItem("courseTitle", courseTitle); sessionStorage.setItem("courseDescription", courseDescription); this.props.navigate("/editcourse")};
  
        var viewButton = document.createElement("button");
        viewButton.setAttribute("class", "courseViewButton");
        viewButton.setAttribute("value", courseId);
        viewButton.innerHTML = "View";
        viewButton.onclick = () => {sessionStorage.setItem("courseId", courseId); sessionStorage.setItem("courseTitle", courseTitle); sessionStorage.setItem("courseDescription", courseDescription); this.props.navigate("/viewcourse")};
  
        cell4.appendChild(viewButton);
        cell5.appendChild(editButton);
  
        rowCount += 1;
      }
    });
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>My Courses</h1> 

      <div id="course_info_table">
        <table id="course-info-table">
          <tr>
            <th>Course Title</th>
            <th>Course Description</th>
            <th>Class</th>
            <th></th>
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
	return <MyCourses navigate={navigate} />;
}