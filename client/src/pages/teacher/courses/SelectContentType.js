import React, { Component } from 'react';
import { useNavigate, useParams } from "react-router-dom"

class SelectContentType extends Component {

	state = {
		creator: sessionStorage.getItem("username"),
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
		let { id } = this.props.params;
		this.setState({courseId: id});
		
        var textImageButton = document.getElementById("text-image-content-button");
        textImageButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/addtextimage");};

		var videoButton = document.getElementById("video-content-button");
        videoButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/addvideo");};

		var exerciseButton = document.getElementById("exercise-content-button");
        exerciseButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/addchoiceexercise");};

		var fillInTheGapButton = document.getElementById("fill-in-gap-exercise-content-button");
        fillInTheGapButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/addgapexercise");};

		var assignmentButton = document.getElementById("assignment-content-button");
        assignmentButton.onclick = () => {this.props.navigate("/editcourse/" + this.state.courseId + "/addassignment");};
    }

	render() {
		const {navigate} = this.props;

		return (
            <>
            <h2>Select content to add</h2>
            <button id="text-image-content-button">Text and Images</button>
            <button id="video-content-button">Video</button>
            <button>Slideshow Presentation</button>
            <button id="exercise-content-button">Multiple Choice Exercise</button>
			<button id="fill-in-gap-exercise-content-button">Fill in the Gap Exercise</button>
            <button id="assignment-content-button">Assignment</button>
			</>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
	const params = useParams();
  
	return <SelectContentType navigate={navigate} params={params} />;
  
}
