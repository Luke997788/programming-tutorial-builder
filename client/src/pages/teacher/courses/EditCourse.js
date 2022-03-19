import React, { Component } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './mycourses.css';

class EditCourse extends Component {

  state = {
    title: '',
    description: '',
    courseId: '',
    contentId: '',
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

    this.retrieveCourseDetails().then(data => {
      this.retrieveCourseContentInformation();
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

  async retrieveCourseDetails() {
    let { id } = this.props.params;
    this.setState({courseId: id});

    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getspecificcourseinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({idToGet: id}),
    });

    await response.json().then(data => {
      if (data[0] == 'failed') {
        this.props.navigate("/mycourses")
      }
      
      this.setState({title: data[0]});
      this.setState({description: data[1]});
  
      var editCourseDetailsButton = document.getElementById("edit-course-details");
      editCourseDetailsButton.onclick = () => {this.props.navigate("/editcoursedetails/" + this.state.courseId)};
    });
  }

  async retrieveCourseContentInformation() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getcoursecontentinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: this.state.courseId}),
    });

    await response.json().then(data => {
      var table = document.getElementById("course-info-table");
      var rowCount = 1;
      var nextContentPosition = data.length + 1;
      sessionStorage.setItem("nextContentPosition", nextContentPosition);

      for(let i=0; i < data.length; i++) {
        let order = data[i][0];
        let contentTitle = data[i][1];
        let contentType = data[i][2];
        let dateLastModified = data[i][3].replace("T", ' ').replace("Z", '');
        let contentId = data[i][4];
  
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
  
        cell1.innerHTML = order;
        cell2.innerHTML = contentTitle;
        cell3.innerHTML = contentType;
        cell4.innerHTML = dateLastModified;
  
        var editButton = document.createElement("button");
        editButton.setAttribute("class", "content-edit-button");
        editButton.innerHTML = "Edit Content";
  
        if (contentType === 'Text/Image') {
          editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/edittextimage/" + contentId)};
        } else if (contentType === 'Video') {
          editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editvideo/" + contentId)};
        } else if (contentType === 'Multiple Choice Exercise') {
          editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editchoiceexercise/" + contentId)};
        } else if (contentType === 'Fill in the Gap Exercise') {
          editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editgapexercise/" + contentId)};
        } else if (contentType === 'Assignment') {
          editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editassignment/" + contentId)};
        }
        cell5.appendChild(editButton);
  
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

      <div class="dropdown">
        <button class="add-course-content-button">Add Content</button>
        <div class="dropdown-content">
          <Link to={"/editcourse/" + this.state.courseId + "/addtextimage"}>Text/Image</Link>
          <Link to={"/editcourse/" + this.state.courseId + "/addvideo"}>Video</Link>
          <Link to={"/editcourse/" + this.state.courseId + "/addchoiceexercise"}>Multiple Choice Exercise</Link>
          <Link to={"/editcourse/" + this.state.courseId + "/addgapexercise"}>Fill in the Gap Exercise</Link>
          <Link to={"/editcourse/" + this.state.courseId + "/addassignment"}>Assignment Task</Link>
        </div>

      </div>

      <div id="course_info_table">
        <table id="course-info-table">
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Type</th>
            <th>Last Modified</th>
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
	return <EditCourse navigate={navigate} params={params} />;
}