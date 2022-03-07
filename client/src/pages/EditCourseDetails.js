import React, { Component } from 'react';
import { useNavigate } from "react-router-dom"
import './homepage.css';

class EditCourseDetails extends Component {

	state = {
		response: '',
		responseToPost: '',
		title: '',
		description: '',
		targetClass: '',
		order: '',
		hide: '',
		creator: sessionStorage.getItem("username"),
        tableData: '',
	};

	componentDidMount = () => {
		this.callApi()
			.then(res => this.setState({ response: res.express }))
			.catch(err => console.log(err));

        this.test();
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

    async test() {
        // starts a request, passes URL and configuration object
        const response = await fetch('/api/getspecificcourseinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: global.courseId}),
        });
    
        const body = await response.text()
    
        this.setState({ responseToPost: body });
    
        var dataForTable = body.split("[").join(']').split(']').join(',').split(',');
        this.setState({responseToPost: dataForTable });
    
        
        var arr = [];
        var index = 0;
        for(let i=0; i < this.state.responseToPost.length; i++) {
          if ((this.state.responseToPost[i] !== undefined) && (this.state.responseToPost[i] !== null) && (this.state.responseToPost[i] !== '')) {
            arr[index] = this.state.responseToPost[i];
            index += 1;
          }
        }
    
        this.setState({tableData: arr});
        this.setState({title: this.state.tableData[2].replaceAll('"','')})
        this.setState({description: this.state.tableData[3].replaceAll('"','')})
        this.setState({targetClass: this.state.tableData[4].replaceAll('"','')})
        this.setState({order: this.state.tableData[5].replaceAll('"','')})
        this.setState({hide: this.state.tableData[6].replaceAll('"','')})
    }

	callApi = async () => {
		// starts a request
		const response = await fetch('/api/status');
		// extract JSON object from the response
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
  
			return body;
	};

	handleSubmit = async e => {
		e.preventDefault();

		// starts a request, passes URL and configuration object
		const response = await fetch('/api/updatecourseinfo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ idToGet: global.courseId, creator: this.state.creator, title: this.state.title, description: this.state.description, targetClass: this.state.targetClass, order: this.state.order, hide: this.state.hide}),
		});

		const body = await response.text();

		if (body === 'successful update') {
			this.setState({ responseToPost: 'Course details successfully updated' });
            this.props.navigate("/editcourse")
		} else {
			this.setState({ responseToPost: 'ERROR: failed to update course' });
		}
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

			  <p>{this.state.responseToPost}</p>
		  </div>
		);
	}
}

export default function(props) {
	const navigate = useNavigate();
  
	return <EditCourseDetails navigate={navigate} />;
  
}