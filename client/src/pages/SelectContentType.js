import React, { Component } from 'react';
import { useNavigate } from "react-router-dom"
import './homepage.css';
import './addcontent.css';

class SelectContentType extends Component {

	state = {
		creator: sessionStorage.getItem("username"),
		title: '',
	};

	componentDidMount = () => {
        const status = sessionStorage.getItem('username');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		const role = sessionStorage.getItem('role');

		if (role == "student") {
			this.props.navigate("/studenthome");
		}

		this.setState({title: sessionStorage.getItem("courseTitle").replaceAll('"','')});
        this.setOnClickFunctions();
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

    setOnClickFunctions() {
        var textImageButton = document.getElementById("text-image-content-button");
        textImageButton.onclick = () => {this.props.navigate("/editcourse/addtextimage");};

		var videoButton = document.getElementById("video-content-button");
        videoButton.onclick = () => {this.props.navigate("/editcourse/addvideo");};

		var exerciseButton = document.getElementById("exercise-content-button");
        exerciseButton.onclick = () => {this.props.navigate("/editcourse/addexercise");};
    }

	render() {
		const {navigate} = this.props;

		return (
            <>
            <h2>Select content to add to {this.state.title}</h2>
            <button id="text-image-content-button">Text and Images</button>
            <button id="video-content-button">Video</button>
            <button>Slideshow Presentation</button>
            <button id="exercise-content-button">Exercise</button>
            </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <SelectContentType navigate={navigate} />;
  
}
