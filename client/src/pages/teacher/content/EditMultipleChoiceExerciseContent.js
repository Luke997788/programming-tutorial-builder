import React, { Component } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';

class EditMultipleChoiceExerciseContent extends Component {

	state = {
        title: '',
		creator: '',
        courseId: '',
        testId: '',
        contentId: '',
        contentTitle: '',
        contentType: 'exercise',
        task: ``,
        content: ``,
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        correctAnswer: '',
        responseToPostRequest: '',
        correctFeedbackMessage: '',
        incorrectFeedbackMessage: '',
	};

	componentDidMount = () => {
        this.setState({creator: sessionStorage.getItem("username")});
        
        this.retrieveCourseDetails().then(data => {
            if(!(!this.state.testId)) {
                this.retrieveTestExerciseTask().then(item => {
                    this.retrieveTestExerciseAnswers();
                });
            } else {
                this.retrieveExerciseTask().then(x => {
                    this.retrieveExerciseAnswers();
                });
            }
        });
	}

	componentDidUpdate() {
		const status = sessionStorage.getItem('username');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		const role = sessionStorage.getItem('role');

		if (role == "student") {
			this.props.navigate("/studenthome");
		}
	}

    async retrieveCourseDetails() {
        let { id, testid, contentid } = this.props.params;
        this.setState({courseId: id});
        this.setState({testId: testid});
        this.setState({contentId: contentid});
        
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
            });
    }

    async retrieveExerciseTask() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecifictutorialcontent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: this.state.courseId, contentId: this.state.contentId}),
        });
    
        await response.json().then(data => {
            if (data[0] == 'failed') {
                this.props.navigate("/mycourses");
            }
        
            this.setState({ contentTitle: data[0] });
            this.setState({ task: data[1] });
        });
    }

    async retrieveTestExerciseTask() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecifictestexercise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ testId: this.state.testId, contentId: this.state.contentId}),
        });
    
        await response.json().then(data => {
            if (data[0] == 'failed') {
                this.props.navigate("/mycourses");
            }
        
            this.setState({ contentTitle: data[0] });
            this.setState({ task: data[1] });
            this.setState({correctFeedbackMessage: data[2]});
            this.setState({incorrectFeedbackMessage: data[3]});

            if (!(!this.state.testId)) {
                var correctMessageInputContainer = document.getElementById("correct-message-input-container");
                var incorrectMessageInputContainer = document.getElementById("incorrect-message-input-container");

                var correctMessageInput = document.createElement("input");
                var incorrectMessageInput = document.createElement("input");

                correctMessageInput.setAttribute("value", this.state.correctFeedbackMessage);
                incorrectMessageInput.setAttribute("value", this.state.incorrectFeedbackMessage);

                correctMessageInput.onchange = (e) => {this.setState({correctFeedbackMessage: e.target.value})};
                incorrectMessageInput.onchange = (e) => {this.setState({incorrectFeedbackMessage: e.target.value})};

                correctMessageInputContainer.appendChild(correctMessageInput);
                incorrectMessageInputContainer.appendChild(incorrectMessageInput);

            }
        });
    }

    async retrieveContentId() {

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/retrievecontentid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({idToGet: this.state.courseId, title: this.state.contentTitle}),
        });

        await response.text().then(data => {
            this.setState({contentId: data});
        });
	};

    async retrieveExerciseAnswers() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getexerciseanswers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contentId: this.state.contentId }),
        });
    
        await response.json().then(data => {
            this.setState({answer1: data[0]});
            this.setState({answer2: data[1]});
            this.setState({answer3: data[2]});
            this.setState({answer4: data[3]});
            this.setState({correctAnswer: data[4]});
        });
    }

    async retrieveTestExerciseAnswers() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/gettestexerciseanswers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exerciseId: this.state.contentId }),
        });
    
        await response.json().then(data => {
            this.setState({answer1: data[0]});
            this.setState({answer2: data[1]});
            this.setState({answer3: data[2]});
            this.setState({answer4: data[3]});
            this.setState({correctAnswer: data[4]});
        });
    }

    async updateTutorialInformation() {
        var contentToSubmit = '';

        if (this.state.content == '') {
          contentToSubmit = this.state.task;
        } else {
          contentToSubmit = this.state.content;
        }

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/updatetutorialcontent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({courseId: this.state.courseId, contentId: this.state.contentId, title: this.state.contentTitle, content: contentToSubmit}),
        });

        await response.text().then(data => {
            if (data === 'successful insertion') {
                this.setState({ responseToPostRequest: 'Tutorial information updated' });
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial information' });
            }
        });
	};

    async updateExerciseAnswers() {
        var contentToSubmit = '';

        if (this.state.content == '') {
          contentToSubmit = this.state.task;
        } else {
          contentToSubmit = this.state.content;
        }

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/updateexerciseanswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contentId: this.state.contentId, courseId: this.state.courseId, task: contentToSubmit, answer1: this.state.answer1, answer2: this.state.answer2, answer3: this.state.answer3, answer4: this.state.answer4, correctAnswer: this.state.correctAnswer}),
        });

        await response.text().then(data => {
            if (data === 'successful update') {
                this.setState({ responseToPostRequest: 'Tutorial answers successfully updated' });
                this.props.navigate("/editcourse/" + this.state.courseId);
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial answers' });
            }
        });
	};

    async updateTestExerciseInformation() {
        var contentToSubmit = '';

        if (this.state.content == '') {
          contentToSubmit = this.state.task;
        } else {
          contentToSubmit = this.state.content;
        }

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/updatetestexercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({testId: this.state.testId, exerciseId: this.state.contentId, title: this.state.contentTitle, content: contentToSubmit, correctMessage: this.state.correctFeedbackMessage, incorrectMessage: this.state.incorrectFeedbackMessage}),
        });

        await response.text().then(data => {
            if (data === 'successful insertion') {
                this.setState({ responseToPostRequest: 'Tutorial information updated' });
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial information' });
            }
        });
	};

    async updateTestExerciseAnswers() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/updatetestexerciseanswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId: this.state.contentId, testId: this.state.testId, answer1: this.state.answer1, answer2: this.state.answer2, answer3: this.state.answer3, answer4: this.state.answer4, correctAnswer: this.state.correctAnswer}),
        });

        await response.text().then(data => {
            if (data === 'successful update') {
                this.setState({ responseToPostRequest: 'Tutorial answers successfully updated' });
                this.props.navigate("/editcourse/" + this.state.courseId + "/edittest/" + this.state.testId);
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial answers' });
            }
        });
	};

    handleEditorChange = (e) => {
        console.log(
          'Content was updated:',
          e.target.getContent()
        );
    
        this.setState({content: e.target.getContent()});
    }

    handleSubmit = async e => {
        e.preventDefault();

        if(!(!this.state.testId)) {
            this.updateTestExerciseInformation().then(data => {
                this.updateTestExerciseAnswers();
            });
        } else {
            this.updateTutorialInformation().then(item => {
                this.updateExerciseAnswers();
            });
        }
    };

	render() {
		const {navigate} = this.props;

		return (
			<>
			<div id="exercise-information-container">
			    <h1>Edit multiple choice exercise for {this.state.title}</h1>

                <div>
                    <label for="content-title">Enter a title for the exercise</label>
				    <input type="text" id="content-title" value={this.state.contentTitle} onChange={e => this.setState({ contentTitle: e.target.value })}/>
                </div>

                    <p>Enter the question or task below</p>
                    <Editor
                            //tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                            apiKey='6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o'
                            initialValue= {this.state.task}
                            init={{
                            selector: 'text-area',
                            height: 500,

                            menu: {
                                edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
                                view: { title: 'View', items: 'fullscreen preview' },
                                insert: { title: 'Insert', items: 'image link media inserttable insertdatetime | charmap emoticons hr | codesample' },
                                format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' }
                            },

                            menubar: 'edit view insert format',

                            plugins: [
                                'advlist autolink lists link image imagetools',
                                'charmap print preview anchor help',
                                'searchreplace visualblocks code',
                                'insertdatetime media table paste wordcount',
                                'emoticons autosave code codesample fullscreen hr',
                                'textcolor'
                            ],

                            toolbar: [
                                'undo redo | bold italic underline strikethrough superscript subscript | \
                                formatselect | fontselect fontsizeselect forecolor backcolor | \
                                align bullist numlist lineheight outdent indent | help'
                            ],

                            fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",

                            help_tabs: 'shortcuts',

                            content_style: "body { font-family: Arial; }",

                            font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; \
                            Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; \
                            Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; \
                            Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; \
                            Webdings=webdings; Wingdings=wingdings,zapf dingbats"
                        
                            }}
                            onChange={this.handleEditorChange}
                        />

                    <div>
                        <label for="multiple-choice-answer-1">Answer 1</label>
				        <input type="text" id="multiple-choice-answer-1" value={this.state.answer1} onChange={e => this.setState({ answer1: e.target.value })}/>
                    </div>

                    <div>
                        <label for="multiple-choice-answer-2">Answer 2</label>
				        <input type="text" id="multiple-choice-answer-2" value={this.state.answer2} onChange={e => this.setState({ answer2: e.target.value })}/>
                    </div>

                    <div>
                        <label for="multiple-choice-answer-3">Answer 3</label>
				        <input type="text" id="multiple-choice-answer-3" value={this.state.answer3} onChange={e => this.setState({ answer3: e.target.value })}/>
                    </div>

                    <div>
                        <label for="multiple-choice-answer-4">Answer 4</label>
				        <input type="text" id="multiple-choice-answer-4" value={this.state.answer4} onChange={e => this.setState({ answer4: e.target.value })}/>
                    </div>

                    <div>
                        <label for="correct-answer-select">Which option is the correct answer?</label>
                        <select id="correct-answer-select" value={this.state.correctAnswer} onChange={e => this.setState({ correctAnswer: e.target.value })}>
					        <option value="1">Answer 1</option>
					        <option value="2">Answer 2</option>
					        <option value="3">Answer 3</option>
					        <option value="4">Answer 4</option>
				        </select>
                    </div>

                    <div id="correct-message-input-container">
                        <p id="correct-message-input"></p>
                    </div>

                    <div id="incorrect-message-input-container">
                        <p id="incorrect-message-input"></p>
                    </div>

                    <div id="submit-button-container">
				       <button onClick={this.handleSubmit}>Save Exercise</button>
				    </div>

		  </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
    const params = useParams();
  
	return <EditMultipleChoiceExerciseContent navigate={navigate} params={params} />;
  
}