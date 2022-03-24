import React, { Component } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import './viewcourse.css';
import TextEditor from './TextEditor';

class StudentViewCourse extends Component {

  state = {
    courseId: '',
    courseTitle: '',
    responseData: '',
    currentTutorial: 0,
    numberOfTutorials: 0,
    correctAnswer: 0,
    correctAnswerText: '',
    answerSelected: 0,
    displayEditor: false,
    tutorialData: '',
    data: '',
  };

  tutorialContent;
  gapAnswers = [];
  gapInputValues = [];
  gapTask = ``;
  fileToSubmit;

  componentDidMount() {
	const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "teacher") {
			this.props.navigate("/home");
		}

    //var backButton = document.getElementById("back-to-my-courses-button").onclick  = () => {this.props.navigate("/mycourses")};

      this.retrieveCourseDetails().then(data => {
        this.retrieveCourseTutorialContent().then(item => {
          this.displayTutorial(this.state.currentTutorial);
          this.displayNavigationMenu();
        })
      });

      //this.displayNavigationMenu();
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
			this.props.navigate("/studentmycourses")
		  }
		  
		  this.setState({courseTitle: data[0]});
		});
	}

  async retrieveCourseTutorialContent() {
    let { id } = this.props.params;
		this.setState({courseId: id});

    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getallcoursetutorialcontent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({idToGet: id}),
    });

    await response.json().then(data => {
      this.tutorialContent = data;
      this.state.numberOfTutorials = data.length - 1;
    })
  }

  async displayTutorial(tutorialToDisplay) {
    var tutorialTitle = document.getElementById("tutorial-title").innerHTML = "" + this.tutorialContent[tutorialToDisplay][1];
    var tutorialContent = document.getElementById("tutorial-content").innerHTML = "" + this.tutorialContent[tutorialToDisplay][3];
    var resultMessage = document.getElementById("result-message").innerHTML = "";

    if ((this.tutorialContent[tutorialToDisplay][2] == 'Text/Image') || (this.tutorialContent[tutorialToDisplay][2] == 'Video')) {
      var submitAnswerButton = document.getElementById("submit-answer-button").style.display = 'none';
      var courseEndMessage = document.getElementById("end-of-course-message").innerHTML = '';
      var editor = document.getElementById("editor").style.display='none';
      var answer1 = document.getElementById("answer-1-option").innerHTML = '';
      var answer2 = document.getElementById("answer-2-option").innerHTML = '';
      var answer3 = document.getElementById("answer-3-option").innerHTML = '';
      var answer4 = document.getElementById("answer-4-option").innerHTML = '';
      var checkbox1 = document.getElementById("answer-1-checkbox").innerHTML = '';
      var checkbox2 = document.getElementById("answer-2-checkbox").innerHTML = '';
      var checkbox3 = document.getElementById("answer-3-checkbox").innerHTML = '';
      var checkbox4 = document.getElementById("answer-4-checkbox").innerHTML = '';
      
    } else if (this.tutorialContent[tutorialToDisplay][2] == 'Multiple Choice Exercise') {
      var courseEndMessage = document.getElementById("end-of-course-message").innerHTML = '';
      var editor = document.getElementById("editor").style.display='none';

      this.retrieveExerciseAnswers(this.tutorialContent[tutorialToDisplay][4]);

    } else if (this.tutorialContent[tutorialToDisplay][2] == 'Fill in the Gap Exercise') {
      var courseEndMessage = document.getElementById("end-of-course-message").innerHTML = '';
      var editor = document.getElementById("editor").style.display='none';

      this.gapTask = "" + this.tutorialContent[tutorialToDisplay][3];
      this.retrieveGapExerciseAnswers(this.tutorialContent[tutorialToDisplay][4]);

    }  else if (this.tutorialContent[tutorialToDisplay][2] == 'Assignment') {
      var courseEndMessage = document.getElementById("end-of-course-message").innerHTML = '';
      var submitAnswerButton = document.getElementById("submit-answer-button").style.display = 'none';
      var editor = document.getElementById("editor").style.display='block';
      sessionStorage.setItem("assignmentContentId", this.tutorialContent[tutorialToDisplay][4]);
      var answer1 = document.getElementById("answer-1-option").innerHTML = '';
      var answer2 = document.getElementById("answer-2-option").innerHTML = '';
      var answer3 = document.getElementById("answer-3-option").innerHTML = '';
      var answer4 = document.getElementById("answer-4-option").innerHTML = '';
      var checkbox1 = document.getElementById("answer-1-checkbox").innerHTML = '';
      var checkbox2 = document.getElementById("answer-2-checkbox").innerHTML = '';
      var checkbox3 = document.getElementById("answer-3-checkbox").innerHTML = '';
      var checkbox4 = document.getElementById("answer-4-checkbox").innerHTML = '';
    }
  }

  async displayNavigationMenu() {
    var tutorialMenu = document.getElementById("tutorial-navigation-menu");

    for (let i=0; i <= this.state.numberOfTutorials; i++) {

      //var row = tutorialMenu.insertRow(i);
      //var cell = row.insertCell(0);

      //cell.className = "tutorial-menu-row";
      //cell.id = "tutorial-menu-row" + i;

      let tutorialToDisplay = i;
      var tutorialSelectButton = document.createElement("button");
      tutorialSelectButton.setAttribute("class", "tutorial-title");
      tutorialSelectButton.setAttribute("id", "" + i);
      tutorialSelectButton.innerHTML = this.tutorialContent[i][1];
      tutorialMenu.appendChild(tutorialSelectButton);
    }

    document.getElementById("" + this.state.currentTutorial).style.backgroundColor = "green";
  }

  async retrieveExerciseAnswers(exerciseContentId) {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getexerciseanswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentId: exerciseContentId }),
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


async retrieveGapExerciseAnswers(exerciseContentId) {
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
    body: JSON.stringify({ contentId: exerciseContentId }),
  });

  await response.text().then(data => {
      var answers = data.split(',');

      this.gapAnswers = [];
      this.gapInputValues = [];
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

    var current = this.state.currentTutorial;

    if (this.state.currentTutorial > 0) {
        var currentTutorial = parseInt(this.state.currentTutorial);
        this.state.currentTutorial = currentTutorial - 1;

        if (this.state.numberOfTutorials == this.state.currentTutorial) {
          document.getElementById("" + this.state.currentTutorial).style.backgroundColor = "green";
        } else {
          document.getElementById("" + this.state.currentTutorial).style.backgroundColor = "green";
          document.getElementById("" + (this.state.currentTutorial+1)).style.backgroundColor = "";
        }
    
        this.displayTutorial(this.state.currentTutorial);
    }
  }

  displayNextTutorial = async e => {
    e.preventDefault();

    if (this.state.currentTutorial < this.state.numberOfTutorials) {
        var currentTutorial = parseInt(this.state.currentTutorial);
        this.state.currentTutorial = currentTutorial + 1;

        document.getElementById("" + this.state.currentTutorial).style.backgroundColor = "green";
        document.getElementById("" + (this.state.currentTutorial-1)).style.backgroundColor = "";
    
        this.displayTutorial(this.state.currentTutorial);

    } else if (this.state.currentTutorial == this.state.numberOfTutorials) {
      var currentTutorial = parseInt(this.state.currentTutorial);
      this.state.currentTutorial = currentTutorial + 1;
      document.getElementById("" + (this.state.currentTutorial-1)).style.backgroundColor = "";

      var courseEndMessage = document.getElementById("end-of-course-message").innerHTML = 'Course Complete!';
      var editor = document.getElementById("editor").style.display='none';

      var tutorialTitle = document.getElementById("tutorial-title").innerHTML = "";
      var tutorialContent = document.getElementById("tutorial-content").innerHTML = "";
      var resultMessage = document.getElementById("result-message").innerHTML = "";
      var submitAnswerButton = document.getElementById("submit-answer-button").style.display = 'none';
      var answer1 = document.getElementById("answer-1-option").innerHTML = '';
      var answer2 = document.getElementById("answer-2-option").innerHTML = '';
      var answer3 = document.getElementById("answer-3-option").innerHTML = '';
      var answer4 = document.getElementById("answer-4-option").innerHTML = '';
      var checkbox1 = document.getElementById("answer-1-checkbox").innerHTML = '';
      var checkbox2 = document.getElementById("answer-2-checkbox").innerHTML = '';
      var checkbox3 = document.getElementById("answer-3-checkbox").innerHTML = '';
      var checkbox4 = document.getElementById("answer-4-checkbox").innerHTML = '';

      var courseEndMessage = document.getElementById("end-of-course-message").innerHTML = 'Course Complete!';
  }
}

  render () {
    const {navigate} = this.props;

    return (
      <>
      <div id="course-container">
        <div id="tutorial-navigation-menu">
          <table id="tutorial-titles">
          </table>
        </div>
        
        <div id="tutorial-container">
          {/*<button id="back-to-my-courses-button">&#8249; {' Back to My Courses'}</button>*/}
          <h5 id="course-title">{this.state.courseTitle}</h5>
          <h1 id="tutorial-title"></h1>

          <div id="tutorial-content"></div>

          <div id="answer-options">
            <p id="answer-1-option"></p>
            <p id="answer-2-option"></p>
            <p id="answer-3-option"></p>
            <p id="answer-4-option"></p>
          </div>

          <div id="editor">
            <TextEditor />
          </div>

          <button id="submit-answer-button" hidden>Submit Answer</button>

          <p id="result-message"></p>

          <div id="end-of-course-container">
            <p id="end-of-course-message"></p>
          </div>

          <div id="navigation-buttons">
            <button id="previous-button" onClick={this.displayPreviousTutorial}>Prev</button>
            <button id="next-button" onClick={this.displayNextTutorial}>Next</button>
          </div>

        </div>
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();

	return <StudentViewCourse navigate={navigate} params={params}/>;
}