import React, { Component } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import './editcoursedetails.css';

class EditCourseDetails extends Component {

	state = {
		courseId: '',
		responseToSubmission: '',
		title: '',
		description: '',
		targetClass: 'CS1001',
		completeInOrder: false,
		hideCourse: false,
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
			this.setState({title: data[0]})
			this.setState({description: data[1]})
			this.setState({targetClass: data[2]})

			if (data[4] == 'true') {
				this.setState({hideCourse: true});
				document.getElementById("hide-course-checkbox").checked = true;
			} else {
				this.setState({hideCourse: false});
				document.getElementById("hide-course-checkbox").checked = false;	
			}

			if (data[5] == 'true') {
				this.setState({completeInOrder: true});
				document.getElementById("order-checkbox").checked = true;
			} else {
				this.setState({completeInOrder: false});
				document.getElementById("order-checkbox").checked = false;
			}
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
			body: JSON.stringify({ idToGet: this.state.courseId, creator: this.state.creator, title: this.state.title, description: this.state.description, targetClass: this.state.targetClass, order: this.state.completeInOrder, hide: this.state.hideCourse}),
		});

		await response.text().then(data => {
			if (data === 'successful update') {
				this.setState({ responseToSubmission: 'Course details successfully updated' });
				this.props.navigate("/editcourse/" + this.state.courseId)
			} else {
				this.setState({ responseToSubmission: 'ERROR: Failed to update course details' });
			}
		});
	};

	render() {
		const {navigate} = this.props;

		return (
			<div id="edit-course-container">

			  <h1 id="edit-course-title">Edit Course Details</h1>

			  <form id="edit-course-form" onSubmit={this.handleSubmit}>
				<div id="title-input-container">
				  <label for="title">Course Title</label>
				  <input type="text" id="title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} required/>
				</div>

				<div id="description-input-container">
				  <label for="description">Description</label>
				  <input type="text" id="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })} required/>
				</div>

				<div id="class-select-container">
				  <label id="class-select-label" for="class-select">Class</label>
				  <select id="class-select" value={this.state.targetClass} onChange={e => this.setState({ targetClass: e.target.value })} required>
					<option value="CS1001">CS1001</option>
					<option value="CS1002">CS1002</option>
					<option value="CS1003">CS1003</option>
					<option value="CS1004">CS1004</option>
				  </select>

					<div id="checkboxes-container">
						<div id="in-order-checkbox-container">
							<label for="order-checkbox">Complete in Order</label>
							<input type="checkbox" id="order-checkbox" onChange={e => this.setState({ completeInOrder: !this.state.completeInOrder })} />
						</div>

						<div id="hide-course-checkbox-container">
							<label for="hide-course-checkbox">Hide Course</label>
							<input type="checkbox" id="hide-course-checkbox" onChange={e => this.setState({ hideCourse: !this.state.hideCourse })} />
						</div>
					</div>
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
	const params = useParams();
  
	return <EditCourseDetails navigate={navigate} params={params} />;
  
}