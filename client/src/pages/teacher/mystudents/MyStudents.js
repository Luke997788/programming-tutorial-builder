import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './mystudents.css';

class MyStudents extends Component {

  state = {
    responseToPost: '',
    tableData: '',
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
    const response = await fetch('/api/getteacherclasses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teacherUsername: sessionStorage.getItem("username")}),
    });

    await response.json().then(data => {
      let information = document.getElementById("teacher-class-information");
      var rowCount = 1;

      for(let i=0; i < data.length; i += 1) {
        let classId = data[i];
  
        let classInformationContainer = document.createElement("div");
        classInformationContainer.style.cssText = 'border: 1px solid black';
  
        let classTitle = document.createElement("h2");
        classTitle.innerHTML = classId;
  
        let viewButton = document.createElement("button");
        viewButton.setAttribute("class", "viewButton");
        viewButton.innerHTML = "View Students";
        viewButton.onclick = () => {this.props.navigate("/mystudents/viewclass/" + classId)};
  
        let lineBreak = document.createElement("br");
  
        classInformationContainer.appendChild(classTitle);
        classInformationContainer.appendChild(viewButton);
        information.appendChild(classInformationContainer);
        information.appendChild(lineBreak);
  
        rowCount += 1;
      }
    });
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>My Students</h1> 
      <div id="teacher-class-information"></div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
	return <MyStudents navigate={navigate} />;
}