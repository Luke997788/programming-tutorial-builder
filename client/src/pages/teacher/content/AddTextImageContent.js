import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom"
//import './homepage.css';
import './addcontent.css';
import TextImageContentEditor from './TextImageContentEditor';

class AddTextImageContent extends Component {

	state = {
		textBoxContents: '',
		creator: sessionStorage.getItem("username"),
		title: '',
	};

	componentDidMount = () => {		
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

	render() {
		const {navigate} = this.props;

		return (
			<>
			<div id="create-a-course-container">
			  <h1>Add Text/Image Content to {this.state.title}</h1>

				<TextImageContentEditor />

		  </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <AddTextImageContent navigate={navigate} />;
  
}