import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './mycourses.css';

class EditCourse extends Component {

  state = {
    responseToPost: '',
    tableData: '',
    title: '',
    description: '',
    contentInformation: '',
    information: '',
  };

  x;

  componentDidMount() {
		const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}
    this.setState({title: sessionStorage.getItem("courseTitle")});
    this.setState({description: sessionStorage.getItem("courseDescription")});
    this.test();
    this.retrieveCourseContentInformation();
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

    if (role == "teacher") {

    }
	}

  async test() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getspecificcourseinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId")}),
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
    this.setState({title: this.state.tableData[2].replaceAll('"','')});
    this.setState({description: this.state.tableData[3].replaceAll('"','')});

    var editCourseDetailsButton = document.getElementById("edit-course-details");
    editCourseDetailsButton.onclick = () => {this.props.navigate("/editcoursedetails")};

    var addCourseContent = document.getElementById("add-course-content-button");
    //addCourseContent.onclick = () => {global.courseTitle = this.state.title; this.props.navigate("/editcourse/selectcontent")};
    addCourseContent.onclick = () => {this.props.navigate("/editcourse/selectcontent")};
  }

  async retrieveCourseContentInformation() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getcoursecontentinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: sessionStorage.getItem("courseId")}),
    });

    const body = await response.text()

    this.setState({ contentInformation: body });

    var dataForTable = body.split("[").join(']').split(']').join(',').split(',');
    this.setState({ contentInformation: dataForTable });

    var arr = [];
    var index = 0;
    for(let i=0; i < this.state.contentInformation.length; i++) {
      if ((this.state.contentInformation[i] !== undefined) && (this.state.contentInformation[i] !== null) && (this.state.contentInformation[i] !== '')) {
        arr[index] = this.state.contentInformation[i];
        index += 1;
      }
    }

    this.setState({information: arr});
      
    var table = document.getElementById("course-info-table");
    var rowCount = 1;

    for(let i=0; i < this.state.information.length; i += 3) {
      let order = this.state.information[i].replaceAll('"','');
      let contentTitle = this.state.information[i+1].replaceAll('"','');
      let contentType = this.state.information[i+2].replaceAll('"','');

      var row = table.insertRow(rowCount);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = order;
      cell2.innerHTML = contentTitle;
      cell3.innerHTML = contentType;

      var btn = document.createElement("button");
      btn.setAttribute("class", "contentEditButton");
      btn.innerHTML = "Edit Content";
      btn.onclick = () => {sessionStorage.setItem("contentTitle", contentTitle); this.props.navigate("/editcourse/edittextimage")};
      //btn.onclick = () => {global.courseId = courseId; global.courseTitle = courseTitle; global.courseDescription = courseDescription; this.props.navigate("/editcourse")};
      //btn.onclick = () => {sessionStorage.setItem("courseId", courseId); sessionStorage.setItem("courseTitle", courseTitle); sessionStorage.setItem("courseDescription", courseDescription); this.props.navigate("/editcourse")};

      cell4.appendChild(btn);

      rowCount += 1;
    }
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      {/*<p>{global.courseId}</p>*/}
      <h1>{this.state.title}</h1>
      <p>{this.state.description}</p>
      <button id="edit-course-details">Edit Course Details</button>
      <button>Edit Content</button>
      <button id="add-course-content-button">Add Content</button>

      <div id="course_info_table">
        <table id="course-info-table">
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Type</th>
            <th></th>
          </tr>
        </table>
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
	return <EditCourse navigate={navigate} />;
}