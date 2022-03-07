import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './mycourses.css';

class StudentViewCourse extends Component {

  state = {
    courseTitle: '',
    responseData: '',
    courseTutorialInformation: [[]],
    currentTutorial: 0,
    numberOfTutorials: 0,
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

    this.setState({courseTitle: sessionStorage.getItem("courseTitle").replaceAll('"','')});
    this.retrieveCourseTutorialContent();
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

  async retrieveCourseTutorialContent() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getallcoursetutorialcontent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId")}),
    });

    //const body = await response.text()
    //this.setState({responseData: body});

    //this.setState({courseTutorialInformation: this.state.responseData.split('"NEXT_RECORD",')});

    await response.json().then(data => {
        this.state.numberOfTutorials = data.length - 1;

        var tutorialTitle = document.getElementById("tutorial-title");
        var tutorialContent = document.getElementById("tutorial-content");

        tutorialTitle.innerHTML = "" + data[this.state.currentTutorial][1];
        tutorialContent.innerHTML = "" + data[this.state.currentTutorial][3];
    })
  }

  displayPreviousTutorial = async e => {
    e.preventDefault();

    if (this.state.currentTutorial > 0) {
        var currentTutorial = parseInt(this.state.currentTutorial);
        this.state.currentTutorial = currentTutorial - 1;
    
        this.retrieveCourseTutorialContent();
    }
  }

  displayNextTutorial = async e => {
    e.preventDefault();

    if (this.state.currentTutorial < this.state.numberOfTutorials) {
        var currentTutorial = parseInt(this.state.currentTutorial);
        this.state.currentTutorial = currentTutorial + 1;
    
        this.retrieveCourseTutorialContent();
    }
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h5>{this.state.courseTitle}</h5>
      <div id="tutorial-container">
        <h1 id="tutorial-title"></h1>
        <div id="tutorial-content"></div>
      </div>
      <button id="previous-button" onClick={this.displayPreviousTutorial}>Prev</button>
      <button id="next-button" onClick={this.displayNextTutorial}>Next</button>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
	return <StudentViewCourse navigate={navigate} />;
}