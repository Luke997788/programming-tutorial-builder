import React, { Component } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './homepage.css';

class Homepage extends Component {

  componentDidMount() {
	const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}

		this.retrieveRecentCourses();
		this.retrieveRecentTutorials();
	}

  componentDidUpdate() {
		const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}
	}

	async retrieveRecentCourses() {
		// starts a request, passes URL and configuration object
		const response = await fetch('/api/getrecentcourses', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ creator: sessionStorage.getItem("username")}),
		});

		await response.json().then(data => {
			if (data[0][0] == 'failed') {
				document.getElementById("home-container").innerHTML = '';
				document.getElementById("no-recent-information").innerHTML = "You have not edited any courses or tutorials recently.";
			}

			for (let i=0; i < data.length; i++) {
				var container = document.getElementById("recent-course-container-" + (i+1));

				let courseId = data[i][0];
				let courseTitle = data[i][1];

				document.getElementById("recent-course-" + (i+1)).innerHTML = courseTitle;

				var viewButton = document.createElement("button");
				viewButton.setAttribute("class", "recent-course-view-button");
				viewButton.innerHTML = "View";
				viewButton.onclick = () => {this.props.navigate("/viewcourse/" + courseId)};
				container.appendChild(viewButton);

				var editButton = document.createElement("button");
				editButton.setAttribute("class", "recent-course-edit-button");
				editButton.innerHTML = "Edit";
				editButton.onclick = () => {this.props.navigate('/editcourse/' + courseId)};
				container.appendChild(editButton);
			}
		});
	}

	async retrieveRecentTutorials() {
		// starts a request, passes URL and configuration object
		const response = await fetch('/api/getrecenttutorials', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ creator: sessionStorage.getItem("username")}),
		});

		await response.json().then(data => {
			if (data[0][0] == 'failed') {
				document.getElementById("home-container").innerHTML = '';
				document.getElementById("no-recent-information").innerHTML = "You have not edited any courses or tutorials recently.";
			}

			for (let i=0; i < data.length; i++) {
				var container = document.getElementById("recent-tutorial-container-" + (i+1));

				let contentId = data[i][0];
				let courseId = data[i][1];
				let contentTitle = data[i][2];
				let contentType = data[i][3];

				document.getElementById("recent-tutorial-" + (i+1)).innerHTML = contentTitle;
				document.getElementById("recent-tutorial-type-" + (i+1)).innerHTML = contentType;

				var editButton = document.createElement("button");
				editButton.innerHTML = "Edit";

				if (contentType === 'Text/Image') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/edittextimage/" + contentId)};
				  } else if (contentType === 'Video') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/editvideo/" + contentId)};
				  } else if (contentType === 'Multiple Choice Exercise') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/editchoiceexercise/" + contentId)};
				  } else if (contentType === 'Fill in the Gap Exercise') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/editgapexercise/" + contentId)};
				  } else if (contentType === 'Matching Exercise') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/editmatchingexercise/" + contentId)};
				  } else if (contentType === 'Test') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/edittest/" + contentId)};
				  } else if (contentType === 'Assignment') {
					editButton.onclick = () => {this.props.navigate("/editcourse/" + courseId + "/editassignment/" + contentId)};
				  } 

				container.appendChild(editButton);
			}
		});
	}

  render () {
    const {navigate} = this.props;

    return (
      <>
      <div id="homepage-container">
		  <div id="recent-courses-container">
			  <h2>Recently Viewed Courses</h2>
			<div id="recent-course-container-1">
				<p id="recent-course-1"></p>
			</div>

			<div id="recent-course-container-2">
				<p id="recent-course-2"></p>
			</div>

			<div id="recent-course-container-3">
				<p id="recent-course-3"></p>
			</div>

			<div id="recent-course-container-4">
				<p id="recent-course-4"></p>
			</div>
		  </div>

			<br></br>

		  <div id="recent-tutorials-container">
		  <h2>Recently Viewed Tutorials</h2>
			<div id="recent-tutorial-container-1">
				<p id="recent-tutorial-1"></p>
				<p id="recent-tutorial-type-1"></p>
			</div>

			<div id="recent-tutorial-container-2">
				<p id="recent-tutorial-2"></p>
				<p id="recent-tutorial-type-2"></p>
			</div>

			<div id="recent-tutorial-container-3">
				<p id="recent-tutorial-3"></p>
				<p id="recent-tutorial-type-3"></p>
			</div>

			<div id="recent-tutorial-container-4">
				<p id="recent-tutorial-4"></p>
				<p id="recent-tutorial-type-4"></p>
			</div>
		  </div>
		</div>

		<div id="no-recent-information-container">
			<p id="no-recent-information"></p>
		</div>
		
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();
	return <Homepage navigate={navigate} params={params} />;
}

