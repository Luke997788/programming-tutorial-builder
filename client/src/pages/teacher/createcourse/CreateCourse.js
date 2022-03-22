import React, { Component } from 'react';
import { useNavigate } from "react-router-dom"
import './createcourse.css';

class CreateCourse extends Component {

	state = {
		title: '',
		description: '',
		targetClass: 'CS1001',
		order: '',
		hide: '',
		creator: sessionStorage.getItem("username"),
		responseToSubmission: '',
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

	handleSubmit = async e => {
		e.preventDefault();

		// starts a request, passes URL and configuration object
		const response = await fetch('/api/submitcourseinformation', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ creator: this.state.creator, title: this.state.title, description: this.state.description, targetClass: this.state.targetClass, order: this.state.order, hide: this.state.hide}),
		});

		await response.text().then(data => {
			if (data === 'successful insertion') {
				this.setState({ responseToSubmission: 'Course successfully created' });
				this.props.navigate("/mycourses");
		
			} else {
				this.setState({ responseToSubmission: 'ERROR: Failed to create course' });
			}
		});
	};

	render() {
		const {navigate} = this.props;

		return (
			<div class="container" id="create-a-course-container">
			  <button id="back-to-my-courses-button">&#8249; {' Back to My Courses'}</button>

			  <h1 id="create-course-title">Create a New Course</h1>

			  <form id="create-course-form" onSubmit={this.handleSubmit}>
				<div id="title-input-container">
				  <label id="title-input-label" for="title">Course Title</label>
				  <input type="text" id="title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })}/>
				</div>

				<div id="description-input-container">
				  <label id="description-input-label" for="description">Description</label>
				  <input type="text" id="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })}/>
				</div>


				<div id="class-select-container">
					<label id="class-select-label" for="class-select">Class</label>
					<select id="class-select" value={this.state.targetClass} onChange={e => this.setState({ targetClass: e.target.value })}>
						<option value="CS1001">CS1001</option>
						<option value="CS1002">CS1002</option>
						<option value="CS1003">CS1003</option>
						<option value="CS1004">CS1004</option>
					</select>

					<div id="checkboxes-container">
						<div id="in-order-checkbox-container">
							<label for="order-checkbox">Complete in Order</label>
							<input type="checkbox" id="order-checkbox" onChange={e => this.setState({ order: e.target.value })} />
						</div>

						<div id="hide-course-checkbox-container">
							<label for="hide-course-checkbox">Hide Course</label>
							<input type="checkbox" id="hide-course-checkbox" onChange={e => this.setState({ hide: e.target.value })} />
						</div>
					</div>
				</div>

				<div id="submit-button-container">
				  <input type="submit" id="submit-button" value="Create Course"/>
				</div>
			  </form>
			  <p>{this.state.responseToSubmission}</p>
		  </div>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <CreateCourse navigate={navigate} />;
  
}