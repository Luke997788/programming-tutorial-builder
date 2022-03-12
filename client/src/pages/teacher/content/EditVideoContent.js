import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom"
//import './homepage.css';
import './addcontent.css';
import EditingTextImageContentEditor from './EditingTextImageContentEditor';

class EditVideoContent extends Component {

	state = {
		creator: sessionStorage.getItem("username"),
		courseTitle: '',
		contentTitle: sessionStorage.getItem("contentTitle"),
	};

	componentDidMount = () => {		
		this.setState({courseTitle: sessionStorage.getItem("courseTitle").replaceAll('"','')});
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
			  <h1>Edit Video Content for {this.state.title}</h1>

				<EditingTextImageContentEditor titleOfContent={this.state.contentTitle}/>

		  </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <EditVideoContent navigate={navigate} />;
  
}