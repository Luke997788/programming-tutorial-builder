
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
//import tinymce from "tinymce";
import tinymce from "https://cdn.tiny.cloud/1/6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o/tinymce/5/tinymce.min.js";
import './tutorial-page.css';

class Tiny extends React.Component {

  state = {
    textAreaContents: '',
  };

  componentDidMount = () => {		
		this.setButtonFunctions();
	}

  setButtonFunctions() {
		var saveButton = document.getElementById("save-button");
		var loadButton = document.getElementById("load-button");

		//saveButton.onclick = () => {localStorage.setItem("content", tinymce.get("text-area").getContent())};
		//loadButton.onclick = () => {tinymce.get("text-area").setContent(localStorage.getItem("content"))};

    //saveButton.onclick = () => {this.setState({textAreaContents: tinymce.get("text-area").getContent()})};
    //saveButton.onclick = () => {alert(get("text-area").getContent())};
    //saveButton.onclick = () => {this.handleSave};

    document.getElementById("tutorial-content").innerHTML = localStorage.getItem("content");
	}

  handleEditorChange = (e) => {
    console.log(
      'Content was updated:',
      e.target.getContent()
    );

    this.setState({textAreaContents: e.target.getContent()});
  }

  handleSave = (e) => {
    alert(this.state.textAreaContents);
    localStorage.setItem("content", this.state.textAreaContents);
  }

  handleLoad = (e) => {
    alert(localStorage.getItem("content"));
  }

  generateHTML() {
    //var tinyParser = new tinymce.html.DomParser({validate: true});
    //var root = tinyParser.parse('<h1>content</h1>');
    //body.appendChild(root);
  }

  render() {
    return (
      <>
      <Editor
        //tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        apiKey='6cu1ne0veiukjtacnibio7cbu6auswe97bn0ohl224e32g6o'
        initialValue="<p>Enter content here</p>"
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
        
        <button id="save-button" onClick={this.handleSave}>Save</button>
				<button id="load-button" onClick={this.handleLoad}>Load</button>

      <p>{this.state.textAreaContents}</p>
      <div id="tutorial-content">
        
      </div>
      </>
    );
  }
}

export default Tiny;