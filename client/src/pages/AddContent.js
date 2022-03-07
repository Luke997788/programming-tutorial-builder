import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom"
import './homepage.css';
import './addcontent.css';
import Tiny from './Tiny';

class AddContent extends Component {

	state = {
		textBoxContents: '',
		creator: sessionStorage.getItem("username"),
	};

	componentDidMount = () => {		
		
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
			  <h1>Add Content</h1>

				<Tiny />

		  </div>
		  </>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <AddContent navigate={navigate} />;
  
}