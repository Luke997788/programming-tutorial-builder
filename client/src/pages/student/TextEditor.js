import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from "https://cdn.tiny.cloud/1/6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o/tinymce/5/tinymce.min.js";
import './assignment-editor.css';

class TextEditor extends React.Component {

  state = {
    creator: '',
    courseId: '',
    contentType: 'text/image',
    assignmentName: '',
    textAreaContents: '',
    responseToPostRequest: '',
    initialContents: '',
    content: '',
    contentId: '',
  };

  componentDidMount = () => {		
    this.setState({creator: sessionStorage.getItem("username")});
    this.setState({courseId: sessionStorage.getItem("courseId")});
	}

  handleEditorChange = (e) => {
    console.log(
      'Content was updated:',
      e.target.getContent()
    );

    this.setState({textAreaContents: e.target.getContent()});
  }

  handleSubmit = async e => {
		e.preventDefault();
    var resultMessage = document.getElementById("result-message");

    if (this.state.assignmentName.length < 1) {
      alert("Please enter a title for the submission")
    } else {
      // starts a request, passes URL and configuration object
      const response = await fetch('/api/uploadassignmentsubmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId: sessionStorage.getItem("studentId"), username: sessionStorage.getItem("username"), courseId: sessionStorage.getItem("courseId"), contentId: sessionStorage.getItem("currentContentId"), submission: this.state.textAreaContents}),
      });

      await response.text().then(data => {
        if (data === 'successful insertion') {
          resultMessage.innerHTML =  'Assignment successfully submitted';
        } else {
          resultMessage.innerHTML = 'ERROR: Failed to submit assignment';
        }
      });
    }
	};

  render() {
    return (
      <>
      <div id="assignment-editor">
        <label for="content-title">Enter a name for your assignment submission: </label>
        <input id ="content-title" type="text" placeholder="Enter name" value={this.state.assignmentName} onChange={e => this.setState({ assignmentName: e.target.value })} required />
        <Editor
          //tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
          apiKey='6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o'
          initialValue= {this.state.initialContents}
          init={{
            selector: 'text-area',
            height: 1000,

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
          
        <button id="save-button" onClick={this.handleSubmit}>Submit Assignment</button>
      </div>
      </>
    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  
	return <TextEditor navigate={navigate} />;
  
}