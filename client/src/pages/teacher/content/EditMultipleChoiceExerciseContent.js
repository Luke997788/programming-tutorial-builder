import React, { Component } from 'react';
import { useNavigate } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';
//import './homepage.css';
import './addcontent.css';

class EditMultipleChoiceExerciseContent extends Component {

	state = {
        title: '',
		creator: '',
        courseId: '',
        contentId: '',
        contentTitle: sessionStorage.getItem("contentTitle"),
        contentType: 'exercise',
        task: ``,
        content: ``,
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        correctAnswer: '',
        responseToPostRequest: '',
	};

	componentDidMount = () => {
        this.setState({creator: sessionStorage.getItem("username")});
        this.setState({courseId: sessionStorage.getItem("courseId")});		
		this.setState({title: sessionStorage.getItem("courseTitle").replaceAll('"','')});
        
        this.retrieveExerciseTask().then(data => {
            this.retrieveContentId().then(item => {
                this.retrieveExerciseAnswers();
            })
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

    async retrieveExerciseTask() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecifictutorialcontent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId"), title: sessionStorage.getItem("contentTitle")}),
        });
    
        await response.text().then(data => {
            this.setState({task: data});
        });

        //const body = await response.text()
        //this.setState({ task: body });
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

        //const body = await response.text();
        //this.setState({contentId: body});

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

        /*const body = await response.text();

        if (body === 'successful insertion') {
            this.setState({ responseToPostRequest: 'Tutorial information updated' });
            //this.props.navigate("/editcourse");
        } else {
            this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial information' });
        }*/

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
            body: JSON.stringify({ contentId: this.state.contentId, courseId: sessionStorage.getItem("courseId"), task: contentToSubmit, answer1: this.state.answer1, answer2: this.state.answer2, answer3: this.state.answer3, answer4: this.state.answer4, correctAnswer: this.state.correctAnswer}),
        });

        await response.text().then(data => {
            if (data === 'successful update') {
                this.setState({ responseToPostRequest: 'Tutorial answers successfully updated' });
                this.props.navigate("/editcourse");
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial answers' });
            }
        });

        /*const body = await response.text();

        if (body === 'successful update') {
            this.setState({ responseToPostRequest: 'Tutorial answers successfully updated' });
            //this.props.navigate("/editcourse");
        } else {
            this.setState({ responseToPostRequest: 'ERROR: failed to update tutorial answers' });
        }*/

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
        this.updateTutorialInformation().then(data => {
            this.updateExerciseAnswers();
        });
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

                    <div id="submit-button-container">
				       <button onClick={this.handleSubmit}>Save Exercise</button>
				    </div>

		  </div>
          <p>{this.state.correctAnswer}</p>
          <p>{this.state.contentId}</p>
          <p>{this.state.responseToPostRequest}</p>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <EditMultipleChoiceExerciseContent navigate={navigate} />;
  
}