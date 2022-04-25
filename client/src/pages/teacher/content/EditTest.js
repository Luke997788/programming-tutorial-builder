import React, { Component } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

class EditTest extends Component {

  state = {
    testTitle: '',
    testDescription: '',
    hideCourse: '',
    courseId: '',
    testId: '',
    responseToDeletion: '',
    responseToAnswersDeletion: '',
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

    this.retrieveTestDetails().then(data => {
      this.retrieveTestExercises();
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

  async retrieveTestDetails() {
    let { id, contentid } = this.props.params;
	this.setState({courseId: id});
    this.setState({testId: contentid});

    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getspecifictutorialcontent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({creator: sessionStorage.getItem("username"), idToGet: id, contentId: contentid}),
    });

    await response.json().then(data => {
      if (data[0] == 'failed') {
        this.props.navigate("/mycourses")
      }
      
      this.setState({testTitle: data[0]});
      this.setState({testDescription: data[1]});
      document.getElementById("test-title").innerHTML = data[0];
      document.getElementById("test-description").innerHTML = data[1];

      var editCourseDetailsButton = document.getElementById("edit-test-details");
      editCourseDetailsButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/edittest/" + this.state.testId + "/edittestdetails")};
    });
  }

  async retrieveTestExercises() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/gettestexercisesinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToGet: this.state.testId}),
    });

    await response.json().then(data => {
      if (data[0] == 'failed') {
        document.getElementById("test-content-table-container").style.display = 'none';
        document.getElementById("no-content-message").innerHTML = 'No exercises have been added yet';
      } else {
        document.getElementById("test-content-table-container").style.visibility = 'visible';
        var table = document.getElementById("test-content-table");
        var rowCount = 1;

        for(let i=0; i < data.length; i++) {
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
          var cell6 = row.insertCell(5);
    
          cell1.innerHTML = contentTitle;
          cell2.innerHTML = contentType;
          cell3.innerHTML = dateLastModified;
    
          var editButton = document.createElement("button");
          editButton.setAttribute("class", "content-edit-button");
          editButton.innerHTML = "Edit Content";

          var deleteButton = document.createElement("button");
          deleteButton.setAttribute("class", "course-delete-button");
          deleteButton.innerHTML = 'Delete';
    
          if (contentType === 'Multiple Choice Exercise') {
            editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editchoiceexercise/" + this.state.testId + "/" + contentId)};
            deleteButton.onclick = () => {this.deleteExercise(contentId)};
          } else if (contentType === 'Fill in the Gap Exercise') {
            editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editgapexercise/" + this.state.testId + "/" + contentId)};
            deleteButton.onclick = () => {this.deleteExercise(contentId)};
          } else if (contentType === 'Matching Exercise') {
            editButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/editmatchingexercise/" + this.state.testId + "/" + contentId)};
            deleteButton.onclick = () => {this.deleteExercise(contentId)};
          } 

          cell4.appendChild(editButton);
          cell5.appendChild(deleteButton);
    
          rowCount += 1;
        }
      }
    });
  }

  async deleteExercise(id) {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/deletetestexercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exerciseId: id }),
    });

    await response.text().then(data => {
      if (data == 'deleted') {
        this.setState({ responseToAnswersDeletion: 'Exercise deleted' });
        window.location.reload(true);
      } else {
        this.setState({ responseToAnswersDeletion: 'ERROR: Failed to delete exercise' });
      }
    });
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1 id="test-title"></h1>
      <p id="test-description"></p>

      <button id="edit-test-details">Edit Test Details</button>

      <div class="dropdown">
        <button class="add-course-content-button">Add Content</button>
        <div class="dropdown-content">
          <Link to={"/editcourse/" + this.state.courseId + "/" + this.state.testId + "/addchoiceexercise"}>Multiple Choice Exercise</Link>
          <Link to={"/editcourse/" + this.state.courseId + "/" + this.state.testId + "/addgapexercise"}>Fill in the Gap Exercise</Link>
          <Link to={"/editcourse/" + this.state.courseId + "/" + this.state.testId + "/addmatchingexercise"}>Matching Exercise</Link>
        </div>
      </div>

      <p id="no-content-message"></p>

      <div id="test-content-table-container">
        <table id="test-content-table">
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Last Modified</th>
            <th></th>
            <th></th>
          </tr>
        </table>

        <p>{this.state.responseToDeletion}</p>
        <p>{this.state.responseToAnswersDeletion}</p>
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();
	return <EditTest navigate={navigate} params={params} />;
}