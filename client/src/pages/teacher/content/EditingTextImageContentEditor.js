import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from "https://cdn.tiny.cloud/1/6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o/tinymce/5/tinymce.min.js";
import './tutorial-page.css';

class EditingTextImageContentEditor extends React.Component {

  state = {
    creator: '',
    courseId: '',
    contentType: 'text/image',
    contentTitle: sessionStorage.getItem("contentTitle"),
    textAreaContents: '',
    content: '',
    responseToContentSubmission: '',
    initialContents: '<p>Enter content here</p>',
    contentId: '',
  };

  componentDidMount = () => {		
    this.setState({creator: sessionStorage.getItem("username")});
    this.setState({courseId: sessionStorage.getItem("courseId")});
    this.retrieveTutorialContent();
    this.retrieveContentId();
	}

  async retrieveTutorialContent() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getspecifictutorialcontent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId"), title: sessionStorage.getItem("contentTitle")}),
    });

    const body = await response.text()

    this.setState({ textAreaContents: body });
  }

  async retrieveContentId() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/retrievecontentid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId"), title: this.state.contentTitle}),
    });

    const body = await response.text()

    this.setState({ contentId: body });
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
			body: JSON.stringify({ id: this.state.courseId, creator: this.state.creator, title: this.state.contentTitle, type: this.state.contentType, content: contentToSubmit, contentId: this.state.contentId }),
		});

		const body = await response.text();

		if (body === 'successful update') {
			this.setState({ responseToContentSubmission: 'Tutorial content successfully updated' });
      this.props.navigate("/editcourse");
		} else {
			this.setState({ responseToContentSubmission: 'ERROR: failed to update tutorial content' });
		}
	};

  render() {
    return (
      <>
      <label for="content-title">Content Title: </label>
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
        <p>id is {this.state.contentId}</p>
      </>
    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  
	return <EditingTextImageContentEditor navigate={navigate} />;
  
}