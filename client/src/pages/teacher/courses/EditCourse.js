import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './mycourses.css';

class EditCourse extends Component {

  state = {
    title: '',
    description: '',
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
    this.setState({title: sessionStorage.getItem("courseTitle")});
    this.setState({description: sessionStorage.getItem("courseDescription")});
    this.retrieveCourseDetails();
    this.retrieveCourseContentInformation();
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

  async retrieveCourseDetails() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getspecificcourseinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId")}),
    });

    await response.json().then(data => {
      this.setState({title: data[0]});
      this.setState({description: data[1]});
  
      var editCourseDetailsButton = document.getElementById("edit-course-details");
      editCourseDetailsButton.onclick = () => {this.props.navigate("/editcoursedetails")};
  
      var addCourseContent = document.getElementById("add-course-content-button");
      addCourseContent.onclick = () => {this.props.navigate("/editcourse/selectcontent")};
    });
  }

  async retrieveCourseContentInformation() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getcoursecontentinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId")}),
    });

    await response.json().then(data => {
      var table = document.getElementById("course-info-table");
      var rowCount = 1;
  
      for(let i=0; i < data.length; i++) {
        let order = data[i][0];
        let contentTitle = data[i][1];
        let contentType = data[i][2];
  
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
  
        cell1.innerHTML = order;
        cell2.innerHTML = contentTitle;
        cell3.innerHTML = contentType;
  
        var editButton = document.createElement("button");
        editButton.setAttribute("class", "content-edit-button");
        editButton.innerHTML = "Edit Content";
  
        if (contentType == 'text/image') {
          editButton.onclick = () => {sessionStorage.setItem("contentTitle", contentTitle); this.props.navigate("/editcourse/edittextimage")};
        } else if (contentType == 'video') {
          editButton.onclick = () => {sessionStorage.setItem("contentTitle", contentTitle); this.props.navigate("/editcourse/editvideo")};
        } else if (contentType == 'Multiple Choice Exercise') {
          editButton.onclick = () => {sessionStorage.setItem("contentTitle", contentTitle); this.props.navigate("/editcourse/editchoiceexercise")};
        } else if (contentType == 'Fill in the Gap Exercise') {
          editButton.onclick = () => {sessionStorage.setItem("contentTitle", contentTitle); this.props.navigate("/editcourse/editgapexercise")};
        } else if (contentType == 'Assignment') {
          editButton.onclick = () => {sessionStorage.setItem("contentTitle", contentTitle); this.props.navigate("/editcourse/editassignment")};
        }
        cell4.appendChild(editButton);
  
        rowCount += 1;
      }
    });
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{this.state.title}</h1>
      <p>{this.state.description}</p>
      <button id="edit-course-details">Edit Course Details</button>
      <button>Edit Content</button>
      <button id="add-course-content-button">Add Content</button>

      <div id="course_info_table">
        <table id="course-info-table">
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Type</th>
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
	return <EditCourse navigate={navigate} />;
}