import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom"
//import './homepage.css';
import './addcontent.css';
import EditingTextImageContentEditor from './EditingTextImageContentEditor';

class EditTextImageContent extends Component {

	state = {
		creator: sessionStorage.getItem("username"),
		title: '',
		contentTitle: sessionStorage.getItem("contentTitle"),
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
			  <h1>Edit Text/Image Content for {this.state.title}</h1>

				<EditingTextImageContentEditor titleOfContent={this.state.contentTitle}/>

		  </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <EditTextImageContent navigate={navigate} />;
  
}