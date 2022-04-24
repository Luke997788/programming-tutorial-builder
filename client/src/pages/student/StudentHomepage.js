import React, { Component } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

class StudentHomepage extends Component {

  recentCourseIds = [];
  recentCourseTitles = [];

  componentDidMount() {
	const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "teacher") {
			this.props.navigate("/home");
		}

		this.retrieveCourseIds().then(data => {
            this.retrieveRecentCourses();
        });
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

	async retrieveCourseIds() {
		// starts a request, passes URL and configuration object
		const response = await fetch('/api/getrecentstudentcourseids', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ studentId: sessionStorage.getItem("studentId")}),
		});

		await response.json().then(data => {
            for (let i=0; i < data.length; i++) {
                this.recentCourseIds.push(data[i]);
            }
		});
	}

    async retrieveRecentCourses() {
		// starts a request, passes URL and configuration object
		const response = await fetch('/api/getrecentstudentcourses', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ recentIdOne: this.recentCourseIds[0], recentIdTwo: this.recentCourseIds[1], recentIdThree: this.recentCourseIds[2], recentIdFour: this.recentCourseIds[3]}),
		});

		await response.json().then(data => {
            var idsCovered = [];

            for (let i=0; i < this.recentCourseIds.length; i++) {
                for (let j=0; j < data.length; j++) {
                    if ((this.recentCourseIds[i] == data[j][0]) && !(idsCovered.includes(data[j][0]))) {
                        this.recentCourseTitles.push(data[j][1]);
                        idsCovered.push(data[j][0]);

                        var container = document.getElementById("recent-course-container-" + (i+1));

                        let courseId = data[j][0];
                        let courseTitle = data[j][1];
            
                        document.getElementById("recent-course-" + (i+1)).innerHTML = courseTitle;
            
                        var viewButton = document.createElement("button");
                        viewButton.innerHTML = "View";
                        viewButton.onclick = () => {this.props.navigate("/studentviewcourse/" + courseId)};
                        container.appendChild(viewButton);
                    }
                }
            }
		});
	}

  render () {
    const {navigate} = this.props;

    return (
      <>
      <div id="homepage-container">
          <p>Homepage</p>

		  <div id="recent-courses-container">
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
		
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();
	return <StudentHomepage navigate={navigate} params={params} />;
}