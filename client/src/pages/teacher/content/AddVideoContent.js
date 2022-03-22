import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from "react-router-dom"
import VideoContentEditor from './VideoContentEditor';

class AddVideoContent extends Component {

	state = {
		textBoxContents: '',
		creator: sessionStorage.getItem("username"),
		title: '',
		courseId: '',
	};

	componentDidMount = () => {		
		this.retrieveCourseDetails();
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
		let { id } = this.props.params;
		this.setState({courseId: id});
	
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

	render() {
		const {navigate} = this.props;

		return (
			<>
			<div id="create-a-course-container">
			  <h1>Add Video Content to {this.state.title}</h1>

				<VideoContentEditor />

		  </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
	const params = useParams();
  
	return <AddVideoContent navigate={navigate} params={params}/>;
  
}