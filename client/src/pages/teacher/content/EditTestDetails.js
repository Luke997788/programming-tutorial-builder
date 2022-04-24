import React, { Component } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';

class EditTestDetails extends Component {

	state = {
		textBoxContents: '',
		creator: sessionStorage.getItem("username"),
		title: '',
		courseId: '',
        testId: '',
        contentType: 'Test',
        contentTitle: '',
        textAreaContents: '',
        responseToContentSubmission: '',
        initialContents: '<p>Enter a description of the test here</p>',
        content: '',
        contentId: '',
        orderPosition: '',
	};

	componentDidMount = () => {				
		this.retrieveTestDetails();
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
            body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: id, contentId: contentid}),
        });
    
        await response.json().then(data => {
            if (data[0] == 'failed') {
            this.props.navigate("/mycourses");
            }
    
            this.setState({ contentTitle: data[0] });
            this.setState({ textAreaContents: data[1] });
        });
	  }

      handleEditorChange = (e) => {
        console.log(
          'Content was updated:',
          e.target.getContent()
        );
        
        this.setState({content: e.target.getContent()});
      }
    
      handleSubmit = async e => {
            e.preventDefault();
    
        var contentToSubmit = '';
    
        if (this.state.content == '') {
          contentToSubmit = this.state.textAreaContents;
        } else {
          contentToSubmit = this.state.content;
        }
    
            // starts a request, passes URL and configuration object
            const response = await fetch('/api/updatetutorialcontent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseId: this.state.courseId, creator: this.state.creator, title: this.state.contentTitle, type: this.state.contentType, content: contentToSubmit, contentId: this.state.testId }),
            });
    
            await response.text().then(data => {
          if (data === 'successful update') {
            this.setState({ responseToContentSubmission: 'Test details successfully updated' });
            this.props.navigate("/editcourse/" + this.state.courseId);
          } else {
            this.setState({ responseToContentSubmission: 'ERROR: failed to update test details' });
          }
        });
        };

	render() {
		const {navigate} = this.props;

		return (
			<>
                <div id="create-a-course-container">
                <h1>Edit Test for {this.state.title}</h1>
                <label for="content-title">Test Title: </label>
                <input id ="content-title" type="text" placeholder="Enter content title" value={this.state.contentTitle} onChange={e => this.setState({ contentTitle: e.target.value })}/>
                <Editor
                    //tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                    apiKey='6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o'
                    initialValue= {this.state.textAreaContents}
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
                    
                    <button id="save-button" onClick={this.handleSubmit}>Save</button>
            </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
	const params = useParams();
  
	return <EditTestDetails navigate={navigate} params={params} />;
  
}