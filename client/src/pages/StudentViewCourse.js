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
    contentIdToRetrieve: 0,
    correctAnswer: 0,
    correctAnswerText: '',
    answerSelected: 0,
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
        var resultMessage = document.getElementById("result-message");

        tutorialTitle.innerHTML = "" + data[this.state.currentTutorial][1];
        tutorialContent.innerHTML = "" + data[this.state.currentTutorial][3];
        resultMessage.innerHTML = "";

        if (data[this.state.currentTutorial][2] == 'exercise') {
          this.setState({contentIdToRetrieve: data[this.state.currentTutorial][4]});
          this.retrieveExerciseAnswers();
        }
    })
  }

  async retrieveExerciseAnswers() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getexerciseanswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentId: this.state.contentIdToRetrieve }),
    });

    await response.json().then(data => {
        this.setState({correctAnswer: data[4]});
        this.setState({correctAnswerText: data[this.state.correctAnswer - 1]});

        var answer1 = document.getElementById("answer-1-option");
        var answer2 = document.getElementById("answer-2-option");
        var answer3 = document.getElementById("answer-3-option");
        var answer4 = document.getElementById("answer-4-option");

        answer1.innerHTML = data[0] + '<input id="answer-1-checkbox" type="checkbox" />';
        answer2.innerHTML = data[1] + '<input id="answer-2-checkbox" type="checkbox" />';
        answer3.innerHTML = data[2] + '<input id="answer-3-checkbox" type="checkbox" />';
        answer4.innerHTML = data[3] + '<input id="answer-4-checkbox" type="checkbox" />';

        var checkbox1 = document.getElementById("answer-1-checkbox");
        var checkbox2 = document.getElementById("answer-2-checkbox");
        var checkbox3 = document.getElementById("answer-3-checkbox");
        var checkbox4 = document.getElementById("answer-4-checkbox");

        checkbox1.onclick = () => {this.setState({answerSelected: 1}); this.selectAnswer()};
        checkbox2.onclick = () => {this.setState({answerSelected: 2}); this.selectAnswer()};
        checkbox3.onclick = () => {this.setState({answerSelected: 3}); this.selectAnswer()};
        checkbox4.onclick = () => {this.setState({answerSelected: 4}); this.selectAnswer()};

        var submitAnswerButton = document.getElementById("submit-answer-button");
        submitAnswerButton.innerHTML = "Submit Answer"
        submitAnswerButton.hidden = false;
        submitAnswerButton.onclick = () => {this.submitAnswer()};
    });
}

async selectAnswer() {
  for (let i = 1; i <= 4; i++)
  {
      document.getElementById("answer-" + i + "-checkbox").checked = false;
  }
  document.getElementById("answer-" + this.state.answerSelected + "-checkbox").checked = true;
}

async submitAnswer() {
  var resultMessage = document.getElementById("result-message");
  if (this.state.correctAnswer == this.state.answerSelected) {
    resultMessage.innerHTML = "Correct!";
  } else {
    resultMessage.innerHTML = "Incorrect. The correct answer is " + this.state.correctAnswerText;
  }
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

        <div id="answer-options">
          <p id="answer-1-option"></p>
          <p id="answer-2-option"></p>
          <p id="answer-3-option"></p>
          <p id="answer-4-option"></p>
          <button id="submit-answer-button" hidden></button>
        </div>

        <p id="result-message"></p>

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