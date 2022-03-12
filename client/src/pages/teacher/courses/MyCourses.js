import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
//import './homepage.css';
import './mycourses.css';

class MyCourses extends Component {

  state = {
    responseToPost: '',
    tableData: '',
  };

  componentDidMount() {
		const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
	
		if (!status) {
		  this.props.navigate("/login");
		}

		if (role == "student") {
			this.props.navigate("/studenthome");
		}

    this.test();
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
    const response = await fetch('/api/getcourseinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username")}),
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
      
    var table = document.getElementById("course-info-table");
    var rowCount = 1;

    for(let i=0; i < this.state.tableData.length; i += 5) {
      let courseId = this.state.tableData[i];
      let courseTitle = this.state.tableData[i+2];
      let courseDescription = this.state.tableData[i+3];

      var row = table.insertRow(rowCount);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);

      cell1.innerHTML = courseId.replaceAll('"','');;
      cell2.innerHTML = this.state.tableData[i+1].replaceAll('"','');
      cell3.innerHTML = this.state.tableData[i+2].replaceAll('"','');;
      cell4.innerHTML = this.state.tableData[i+3].replaceAll('"','');;
      cell5.innerHTML = this.state.tableData[i+4].replaceAll('"','');;

      var editButton = document.createElement("button");
      editButton.setAttribute("class", "courseEditButton");
      editButton.setAttribute("value", courseId);
      editButton.innerHTML = "Edit";
      editButton.onclick = () => {sessionStorage.setItem("courseId", courseId); sessionStorage.setItem("courseTitle", courseTitle); sessionStorage.setItem("courseDescription", courseDescription); this.props.navigate("/editcourse")};

      var viewButton = document.createElement("button");
      viewButton.setAttribute("class", "courseViewButton");
      viewButton.setAttribute("value", courseId);
      viewButton.innerHTML = "View";
      viewButton.onclick = () => {sessionStorage.setItem("courseId", courseId); sessionStorage.setItem("courseTitle", courseTitle); sessionStorage.setItem("courseDescription", courseDescription); this.props.navigate("/viewcourse")};

      cell6.appendChild(viewButton);
      cell7.appendChild(editButton);

      rowCount += 1;
    }
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <p>My Courses</p> 
      {/*<button onClick={this.test}>Test</button>*/}
      <p>{this.state.tt}</p>

      <div id="course_info_table">
        <table id="course-info-table">
          <tr>
            <th>Course Id</th>
            <th>Course Creator</th>
            <th>Course Title</th>
            <th>Course Description</th>
            <th>Class</th>
            <th></th>
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
	return <MyCourses navigate={navigate} />;
}