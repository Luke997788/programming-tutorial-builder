import React, { Component } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './mycourses.css';

class MyCourses extends Component {

  state = {
    responseToDeletion: '',
  }

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
      if (data[0][0] == 'failed') {
        var table = document.getElementById("course-info-table").style.display = 'none';
        var container = document.getElementById("course-info-container").innerHTML = 'You have not created any courses yet \n <button id="create-course-button">Create a Course</button>';
        var createCourseButton = document.getElementById("create-course-button").onclick = () => {this.props.navigate('/createacourse')};
      } else {
        var table = document.getElementById("course-info-table");
        var rowCount = 1;
    
        for(let i=0; i < data.length; i++) {
          let courseId = data[i][0];
          let courseTitle = data[i][1];
          let courseDescription = data[i][2];
          let targetClass = data[i][3];
          let dateLastModified = data[i][4].replace("T", ' ').replace("Z", '');
  
          var row = table.insertRow(rowCount);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          var cell5 = row.insertCell(4);
          var cell6 = row.insertCell(5);
          var cell7 = row.insertCell(6);
    
          cell1.innerHTML = courseTitle;
          cell2.innerHTML = courseDescription;
          cell3.innerHTML = targetClass;
          cell4.innerHTML = dateLastModified;
    
          var editButton = document.createElement("button");
          editButton.setAttribute("class", "course-edit-button");
          editButton.setAttribute("value", courseId);
          editButton.innerHTML = "Edit";
          editButton.onclick = () => {this.props.navigate('/editcourse/' + courseId)};
    
          var viewButton = document.createElement("button");
          viewButton.setAttribute("class", "course-view-button");
          viewButton.setAttribute("value", courseId);
          viewButton.innerHTML = 'View';
          viewButton.onclick = () => {this.props.navigate("/viewcourse/" + courseId)};
    
          var deleteButton = document.createElement("button");
          deleteButton.setAttribute("class", "course-delete-button");
          deleteButton.setAttribute("value", courseId);
          deleteButton.innerHTML = 'Delete';
          deleteButton.onclick = () => {this.deleteCourse(courseId)};
  
          cell5.appendChild(viewButton);
          cell6.appendChild(editButton);
          cell7.appendChild(deleteButton);
    
          rowCount += 1;
        }
        table.style.visibility = 'visible';
      }
    });
  }

  async deleteCourse(id) {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/deletecourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId: id}),
    });

    await response.text().then(data => {
      if (data == 'deleted') {
        this.setState({ responseToDeletion: 'Course deleted' });
        window.location.reload(true);
      } else {
				this.setState({ responseToDeletion: 'ERROR: Failed to delete course' });
      }
    });
  }

  render () {
    const {navigate} = this.props;

    return (
      <>

      <div>
        <h1>My Courses</h1> 

        <div>
          <table id="course-info-table">
            <tr>
              <th>Course Title</th>
              <th>Course Description</th>
              <th>Class</th>
              <th>Last Modified</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </table>

          <p>{this.state.responseToDeletion}</p>
        </div>
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
	return <MyCourses navigate={navigate} />;
}