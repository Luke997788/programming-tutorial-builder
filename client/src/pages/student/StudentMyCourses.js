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

    const body = await response.text()

    this.setState({studentClass: body});
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

    const body = await response.text()

    var dataForTable = body.split("[").join(']').split(']').join(',').split(',');
    this.setState({ studentCourseInformation: dataForTable });

    var arr = [];
    var index = 0;
    for(let i=0; i < this.state.studentCourseInformation.length; i++) {
      if ((this.state.studentCourseInformation[i] !== undefined) && (this.state.studentCourseInformation[i] !== null) && (this.state.studentCourseInformation[i] !== '')) {
        arr[index] = this.state.studentCourseInformation[i];
        index += 1;
      }
    }

    this.setState({tableData: arr});
      
    var table = document.getElementById("course-info-table");
    var rowCount = 1;

    for(let i=0; i < this.state.tableData.length; i += 4) {
      let courseId = this.state.tableData[i];
      let courseTitle = this.state.tableData[i+1];
      let courseDescription = this.state.tableData[i+2];
      let targetClass = this.state.tableData[i+3];

      var row = table.insertRow(rowCount);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);

      cell1.innerHTML = courseId.replaceAll('"','');
      cell2.innerHTML = courseTitle.replaceAll('"','');
      cell3.innerHTML = courseDescription.replaceAll('"','');
      cell4.innerHTML = targetClass.replaceAll('"','');

      var viewButton = document.createElement("button");
      viewButton.setAttribute("class", "courseViewButton");
      viewButton.setAttribute("value", courseId);
      viewButton.innerHTML = "View";
      viewButton.onclick = () => {sessionStorage.setItem("courseId", courseId); sessionStorage.setItem("courseTitle", courseTitle); this.props.navigate("/studentviewcourse")};

      cell5.appendChild(viewButton);

      rowCount += 1;
    }
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