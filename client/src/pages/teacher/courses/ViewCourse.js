import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
//import './homepage.css';
import './mycourses.css';

class ViewCourse extends Component {

  state = {
    courseTitle: '',
    responseData: '',
    currentTutorial: 0,
    numberOfTutorials: 0,
    contentIdToRetrieve: 0,
    correctAnswer: 0,
    correctAnswerText: '',
    answerSelected: 0,
  };

  gapAnswers = [];
  gapInputValues = [];
  gapTask = ``;


  componentDidMount() {
	const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
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

		if (role == "student") {
			this.props.navigate("/studenthome");
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

    await response.json().then(data => {
        this.state.numberOfTutorials = data.length - 1;

        var assignmentUpload = document.getElementById("assignment-upload").style.display = 'none';
        var submitAnswerButton = document.getElementById("submit-answer-button").style.display = 'none';
        
        var tutorialTitle = document.getElementById("tutorial-title");
        var tutorialContent = document.getElementById("tutorial-content");
        var resultMessage = document.getElementById("result-message");

        tutorialTitle.innerHTML = "" + data[this.state.currentTutorial][1];
        tutorialContent.innerHTML = "" + data[this.state.currentTutorial][3];
        resultMessage.innerHTML = "";

        if ((data[this.state.currentTutorial][2] == 'text/image') || (data[this.state.currentTutorial][2] == 'video')) {
          var answer1 = document.getElementById("answer-1-option").innerHTML = '';
          var answer2 = document.getElementById("answer-2-option").innerHTML = '';
          var answer3 = document.getElementById("answer-3-option").innerHTML = '';
          var answer4 = document.getElementById("answer-4-option").innerHTML = '';
          var checkbox1 = document.getElementById("answer-1-checkbox").innerHTML = '';
          var checkbox2 = document.getElementById("answer-2-checkbox").innerHTML = '';
          var checkbox3 = document.getElementById("answer-3-checkbox").innerHTML = '';
          var checkbox4 = document.getElementById("answer-4-checkbox").innerHTML = '';
        } else if (data[this.state.currentTutorial][2] == 'Multiple Choice Exercise') {
          this.setState({contentIdToRetrieve: data[this.state.currentTutorial][4]});
          this.retrieveExerciseAnswers();
        } else if (data[this.state.currentTutorial][2] == 'Fill in the Gap Exercise') {
          this.gapTask = "" + data[this.state.currentTutorial][3];
          this.setState({contentIdToRetrieve: data[this.state.currentTutorial][4]});
          this.retrieveGapExerciseAnswers();
        } else if (data[this.state.currentTutorial][2] == 'Assignment') {
          var assignmentUpload = document.getElementById("assignment-upload").style.display = 'block';
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
        submitAnswerButton.style.display = 'block';
        submitAnswerButton.hidden = false;
        submitAnswerButton.onclick = () => {this.submitAnswer()};
    });
}


async retrieveGapExerciseAnswers() {
  var tutorialContent = document.getElementById("tutorial-content");
  var answer1 = document.getElementById("answer-1-option");
  var answer2 = document.getElementById("answer-2-option");
  var answer3 = document.getElementById("answer-3-option");
  var answer4 = document.getElementById("answer-4-option");

  // starts a request, passes URL and configuration object
  const response = await fetch('/api/getgapexerciseanswers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentId: this.state.contentIdToRetrieve }),
  });

  await response.text().then(data => {
      var answers = data.split(',');

      answer1.innerHTML = '';
      answer2.innerHTML = '';
      answer3.innerHTML = '';
      answer4.innerHTML = '';

      for (let i=0; i < answers.length; i++) {
        this.gapAnswers.push(answers[i]);
        this.gapInputValues.push('');
      }

      for (let i=1; i <= this.gapAnswers.length; i++) {
        this.gapTask = this.gapTask.replaceAll('[' + i + ']', `<input type='text' id="gap-answer-` + i + `" value='' />`);
        tutorialContent.innerHTML = this.gapTask;
      }
  
      var submitAnswerButton = document.getElementById("submit-answer-button");
      submitAnswerButton.style.display = 'block';
      submitAnswerButton.onclick = () => {this.submitGapAnswer()};
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

async submitGapAnswer() {
  var resultMessage = document.getElementById("result-message");
  var correctAnswers = [];
  var numberCorrect = 0;

  for (let i=0; i < this.gapAnswers.length; i++) {
    var input = document.getElementById("gap-answer-" + (i+1) + "");
    if (input.value == this.gapAnswers[i]) {
      correctAnswers.push(true);
      numberCorrect += 1;
    } else {
      correctAnswers.push(false);
    }
  }

  if (numberCorrect == this.gapAnswers.length) {
    resultMessage.innerHTML = "All answers correct";
  } else {
    resultMessage.innerHTML = "Incorrect";
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

        <input type="file" id="assignment-upload" />

        <div id="answer-options">
          <p id="answer-1-option"></p>
          <p id="answer-2-option"></p>
          <p id="answer-3-option"></p>
          <p id="answer-4-option"></p>
          <button id="submit-answer-button" hidden>Submit Answer</button>
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
	return <ViewCourse navigate={navigate} />;
}