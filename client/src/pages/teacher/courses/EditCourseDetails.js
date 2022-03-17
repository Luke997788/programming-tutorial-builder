import React, { Component } from 'react';
import { useNavigate } from "react-router-dom"
//import './homepage.css';

class EditCourseDetails extends Component {

	state = {
		responseToSubmission: '',
		title: '',
		description: '',
		targetClass: 'CS1001',
		order: '',
		hide: '',
		creator: sessionStorage.getItem("username"),
        tableData: '',
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
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecificcourseinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({idToGet: sessionStorage.getItem("courseId")}),
        });

		await response.json().then(data => {
			this.setState({title: data[0]})
			this.setState({description: data[1]})
			this.setState({targetClass: data[2]})
		})
    }

	handleSubmit = async e => {
		e.preventDefault();

		// starts a request, passes URL and configuration object
		const response = await fetch('/api/updatecourseinfo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ idToGet: sessionStorage.getItem("courseId"), creator: this.state.creator, title: this.state.title, description: this.state.description, targetClass: this.state.targetClass, order: this.state.order, hide: this.state.hide}),
		});

		await response.text().then(data => {
			if (data === 'successful update') {
				this.setState({ responseToSubmission: 'Course details successfully updated' });
				this.props.navigate("/editcourse")
			} else {
				this.setState({ responseToSubmission: 'ERROR: Failed to update course details' });
			}
		});
	};

	render() {
		const {navigate} = this.props;

		return (
			<div id="edit-course-container">
			  <h1>Edit Course Details</h1>

			  <form id="edit-course-form" onSubmit={this.handleSubmit}>
				<div id="title-input-container">
				  <label for="title">Course Title</label>
				  <input type="text" id="title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })}/>
				</div>

				<div id="description-input-container">
				  <label for="description">Description</label>
				  <input type="text" id="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })}/>
				</div>

				<div id="class-select-container">
				  <label for="class-select">Class</label>
				  <select id="class-select" value={this.state.targetClass} onChange={e => this.setState({ targetClass: e.target.value })}>
					<option value="CS1001">CS1001</option>
					<option value="CS1002">CS1002</option>
					<option value="CS1003">CS1003</option>
					<option value="CS1004">CS1004</option>
				  </select>
				</div>

				<div id="in-order-checkbox-container">
				<label for="order-checkbox">Complete in Order</label>
				  <input type="checkbox" id="order-checkbox" onChange={e => this.setState({ order: e.target.value })} />
				</div>

				<div id="hide-course-checkbox-container">
				<label for="hide-course-checkbox">Hide Course</label>
				  <input type="checkbox" id="hide-course-checkbox" onChange={e => this.setState({ hide: e.target.value })} />
				</div>

				<div id="submit-button-container">
				  <input type="submit" id="submit-button" value="Save"/>
				</div>
			  </form>

			  <p>{this.state.responseToSubmission}</p>
		  </div>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <EditCourseDetails navigate={navigate} />;
  
}