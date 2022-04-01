import React, { Component } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';

class EditMatchingExercise extends Component {

	state = {
        title: '',
		creator: '',
        courseId: '',
        contentId: '',
        contentTitle: '',
        task: ``,
        content: ``,
        itemPairs: '',
        pairOneLeft: '',
        pairOneRight: '',
        pairTwoLeft: '',
        pairTwoRight: '',
        responseToPostRequest: '',
	};

	componentDidMount = () => {
        this.setState({creator: sessionStorage.getItem("username")});
        
        this.retrieveCourseDetails().then(data => {
            this.retrieveExerciseTask().then(item => {
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

    async retrieveCourseDetails() {
        let { id, contentid } = this.props.params;
        this.setState({courseId: id});
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
            var pairs = data[4].split(",");
            this.setState({itemPairs: pairs});

            this.setState({pairOneLeft: pairs[0]});
            this.setState({pairOneRight: pairs[1]});
            this.setState({pairTwoLeft: pairs[2]});
            this.setState({pairTwoRight: pairs[3]});
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
        var exerciseAnswers = [this.state.pairOneLeft, this.state.pairOneRight, this.state.pairTwoLeft, this.state.pairTwoRight];

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
            body: JSON.stringify({ contentId: this.state.contentId, courseId: this.state.courseId, task: contentToSubmit, answer1: exerciseAnswers, correctAnswer: exerciseAnswers}),
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
			    <h1>Edit matching exercise for {this.state.title}</h1>

                <div>
                    <label for="content-title">Enter a title for the exercise</label>
				    <input type="text" id="content-title" value={this.state.contentTitle} onChange={e => this.setState({ contentTitle: e.target.value })}/>
                </div>

                    <p>Edit the description for the task below</p>
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

                    <div id="matching-exercise-content">
                        <p>Edit the pairs for the matching exercise below. The left and right corresponding items will make up a pair and will need to be matched when completing the exercise</p>

                        <div id="pair-1">
                            <input id="pair-1-left-item" type="text" value={this.state.pairOneLeft} onChange={e => this.setState({ pairOneLeft: e.target.value })}/>
                            <input id="pair-1-right-item" type="text" value={this.state.pairOneRight} onChange={e => this.setState({ pairOneRight: e.target.value })}/>
                        </div>

                        <div id="pair-2">
                            <input id="pair-2-left-item" type="text" value={this.state.pairTwoLeft} onChange={e => this.setState({ pairTwoLeft: e.target.value })}/>
                            <input id="pair-2-right-item" type="text" value={this.state.pairTwoRight} onChange={e => this.setState({ pairTwoRight: e.target.value })}/>
                        </div>
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
    const params = useParams();
  
	return <EditMatchingExercise navigate={navigate} params={params} />;
  
}