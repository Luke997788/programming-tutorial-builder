import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';

class AddFillInGapExerciseContent extends Component {

	state = {
        title: '',
		creator: '',
        courseId: '',
        contentId: '',
        contentTitle: '',
        contentType: 'Fill in the Gap Exercise',
        task: ``,
        responseToPostRequest: '',
        orderPosition: '',
	};

    taskContent = ``;
    exerciseAnswers = [];

	componentDidMount = () => {
        this.setState({creator: sessionStorage.getItem("username")});
        this.retrieveCourseDetails().then(data => {
            this.retrieveOrderPosition();
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
		});
	}

    async retrieveOrderPosition() {
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
            if (data[0][0] == 'failed') {
                this.setState({orderPosition: 1});
              } else {
                this.setState({orderPosition: (data.length + 1)});
              }
		});
	}

    handleEditorChange = (e) => {
        console.log(
          'Content was updated:',
          e.target.getContent()
        );
    
        this.setState({task: e.target.getContent()});
    }

    async submitTutorialInformation() {

        var indexesOfSquareBrackets = [];
        for (let i=0; i < this.state.task.length; i++) {
            if (this.state.task[i] == '[') {
                indexesOfSquareBrackets.push(i+1);
            } else if (this.state.task[i] == ']') {
                indexesOfSquareBrackets.push(i);
            }
        }

        var answerCount = 1;
        this.taskContent = this.state.task;
        for (let i=0; i < indexesOfSquareBrackets.length; i += 2) {
            var answer = this.state.task.substring(indexesOfSquareBrackets[i], indexesOfSquareBrackets[i+1]);
            this.exerciseAnswers.push(answer);

            this.taskContent = this.taskContent.replace(answer, '' + answerCount + '');
            answerCount += 1;
        }

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/uploadtutorialcontent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: this.state.courseId, creator: this.state.creator, title: this.state.contentTitle, type: this.state.contentType, content: this.taskContent, orderPosition: this.state.orderPosition}),
        });

        await response.text().then(responseData => {
            if (responseData == 'successful insertion') {
                this.setState({ responseToPostRequest: 'Tutorial information added' });
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to create tutorial content' });
            }
        });
	};

    async retrieveContentId() {

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/retrievecontentid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({idToGet: this.state.courseId, title: this.state.contentTitle}),
        });

        await response.text().then(responseData => {
            this.setState({contentId: responseData}); 
        });
	};

    async submitExerciseAnswers() {

        // starts a request, passes URL and configuration object
        const response = await fetch('/api/uploadexercisecontent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contentId: this.state.contentId, courseId: this.state.courseId, creator: this.state.creator, type: this.state.contentType, task: this.taskContent, answer1: this.exerciseAnswers, correct: this.exerciseAnswers}),
        });

        await response.text().then(responseData => {
            if (responseData == 'successful insertion') {
                this.setState({ responseToPostRequest: 'Tutorial information added' });
                this.props.navigate("/editcourse/" + this.state.courseId);
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to create tutorial content' });
            }
        });
	};

    handleSubmit = async e => {
        e.preventDefault();

        this.submitTutorialInformation().then(data => {
            this.retrieveContentId().then(item => {
                this.submitExerciseAnswers();
            })
        });
    };

	render() {
		const {navigate} = this.props;

		return (
			<>
			<div id="exercise-information-container">
			    <h1>Add a Fill in the Gap exercise to {this.state.title}</h1>

                <div>
                    <label for="content-title">Enter a title for the exercise</label>
				    <input type="text" id="content-title" value={this.state.contentTitle} onChange={e => this.setState({ contentTitle: e.target.value })}/>
                </div>

                    <p>Enter the text for the task below. The words that need to be filled in should be surrounded by square brackets. For example: The word [this] will be replaced by a gap in the exercise.</p>
                    <Editor
                            //tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                            apiKey='6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o'
                            initialValue= {this.state.initialContents}
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

                    <div id="submit-button-container">
				       <button onClick={this.handleSubmit}>Create Exercise</button>
				    </div>

		  </div>
          <p>{this.state.responseToPostRequest}</p>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
    const params = useParams();
  
	return <AddFillInGapExerciseContent navigate={navigate} params={params}/>;
  
}