import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from "https://cdn.tiny.cloud/1/6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o/tinymce/5/tinymce.min.js";

class FeedbackEditor extends React.Component {

  state = {
    courseId: '',
    assignmentId: '',
    studentId: '',
    initialContents: '',
    textAreaContents: '',
    responseToPostRequest: '',
    editingExistingFeedback: false,
  };

  componentDidMount = () => {		
    this.retrieveExistingFeedback();
  }

  async retrieveExistingFeedback() {
    let { assignmentid, studentid } = this.props.params;
    this.setState({assignmentId: assignmentid});
    this.setState({studentId: studentid});

    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getteacherfeedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({studentId: studentid, assignmentId: assignmentid}),
    });

    await response.json().then(data => {
        if (data[0] == 'failed') {
            this.setState({ initialContents: '' });
            document.getElementById("feedback-title").innerHTML = 'Enter feedback for the student below:';
        } else {
            var feedback = data[0];
            this.setState({ initialContents: feedback });
            this.setState({ editingExistingFeedback: true });
            document.getElementById("feedback-title").innerHTML = 'You can edit your previously submitted feedback below: ';
        }
    })
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

        if (this.state.textAreaContents.length < 1) {
            alert("Please enter feedback before submitting")
        } else if (this.state.editingExistingFeedback) {
            // starts a request, passes URL and configuration object
            const response = await fetch('/api/updateteacherfeedback', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignmentId: this.state.assignmentId, studentId: this.state.studentId, feedback: this.state.textAreaContents }),
            });

            await response.text().then(data => {
                if (data === 'successful update') {
                    this.setState({ responseToPostRequest: 'Feedback successfully updated' });
                } else {
                    this.setState({ responseToPostRequest: 'ERROR: failed to update feedback' });
                }
            });
        } else {
             // starts a request, passes URL and configuration object
             const response = await fetch('/api/uploadteacherfeedback', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({ assignmentId: this.state.assignmentId, studentId: this.state.studentId, feedback: this.state.textAreaContents }),
          });

          await response.text().then(data => {
              if (data === 'successful insertion') {
                  this.setState({ responseToPostRequest: 'Feedback successfully submitted' });
              } else {
                  this.setState({ responseToPostRequest: 'ERROR: failed to submit feedback' });
              }
          });         
        }
    };

  render() {
    return (
      <>
      <h4 id="feedback-title"></h4>

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
        
        <button id="save-button" onClick={this.handleSubmit}>Submit Feedback</button>

        <p>{this.state.responseToPostRequest}</p>

      </>
    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();
  
	return <FeedbackEditor navigate={navigate} params={params} />;
  
}