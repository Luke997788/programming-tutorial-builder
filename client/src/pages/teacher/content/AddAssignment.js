import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';
//import './homepage.css';
import './addcontent.css';

class AddAssignment extends Component {

	state = {
        title: '',
		creator: '',
        courseId: '',
        contentTitle: '',
        contentType: 'Assignment',
        task: ``,
        responseToPostRequest: '',
	};

	componentDidMount = () => {
        this.setState({creator: sessionStorage.getItem("username")});
        this.setState({courseId: sessionStorage.getItem("courseId")});		
		this.setState({title: sessionStorage.getItem("courseTitle").replaceAll('"','')});
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

    async uploadAssignmentInformation() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/uploadtutorialcontent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: this.state.courseId, creator: this.state.creator, title: this.state.contentTitle, type: this.state.contentType, content: this.state.task}),
        });

        await response.text().then(responseData => {
            if (responseData == 'successful insertion') {
                this.setState({ responseToPostRequest: 'Tutorial information added' });
                this.props.navigate("/editcourse");
            } else {
                this.setState({ responseToPostRequest: 'ERROR: failed to create tutorial content' });
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

    handleSubmit = async e => {
        e.preventDefault();

        this.uploadAssignmentInformation();
    };

	render() {
		const {navigate} = this.props;

		return (
			<>
			<div id="assignment-information-container">
			    <h1>Add an assignment to {this.state.title}</h1>

                <div>
                    <label for="content-title">Enter a title for the assignment: </label>
				    <input type="text" id="content-title" value={this.state.contentTitle} onChange={e => this.setState({ contentTitle: e.target.value })}/>
                </div>

                <div>
                    <p>Enter a description for the assignment below</p>
                </div>

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
  
	return <AddAssignment navigate={navigate} />;
  
}