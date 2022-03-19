import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './mycourses.css';

class StudentMyCourses extends Component {

  state = {
    studentClass: '',
    studentCourseInformation: '',
    tableData: '',
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

    this.retrieveStudentClass().then(data => {
      this.retrieveStudentCourse();
    })
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

  async retrieveStudentClass() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getstudentclass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: sessionStorage.getItem("username")}),
    });

    await response.text().then(data => {
      this.setState({studentClass: data});
    });
  }

  async retrieveStudentCourse() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getstudentcourses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({targetClass: this.state.studentClass}),
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
  
        cell1.innerHTML = courseId;
        cell2.innerHTML = courseTitle;
        cell3.innerHTML = courseDescription;
        cell4.innerHTML = targetClass;
  
        var viewButton = document.createElement("button");
        viewButton.setAttribute("class", "courseViewButton");
        viewButton.setAttribute("value", courseId);
        viewButton.innerHTML = "View";
        viewButton.onclick = () => {this.props.navigate("/studentviewcourse/" + courseId)};
  
        cell5.appendChild(viewButton);
  
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
            <th>Course Id</th>
            <th>Course Title</th>
            <th>Course Description</th>
            <th>Class</th>
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