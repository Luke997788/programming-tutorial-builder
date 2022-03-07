import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './mycourses.css';

class ViewClass extends Component {

  state = {
    responseToPost: '',
    tableData: '',
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
    const response = await fetch('/api/getclassstudents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ className: global.classId}),
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

    //alert(this.state.tableData);

    for(let i=0; i < this.state.tableData.length; i += 3) {
      let studentId = this.state.tableData[i];

      var row = table.insertRow(rowCount);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = studentId.replaceAll('"','');;
      cell2.innerHTML = this.state.tableData[i+1].replaceAll('"','');
      cell3.innerHTML = this.state.tableData[i+2].replaceAll('"','');

      var btn = document.createElement("button");
      btn.setAttribute("class", "courseEditButton");
      btn.setAttribute("value", studentId);
      btn.innerHTML = "View";
    //btn.onclick = () => {global.courseId = courseId; this.props.navigate("/editcourse")};
      //btn.onclick = () => {alert(courseId)};

      cell4.appendChild(btn);

      rowCount += 1;
    }
  }

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{global.classId} Students</h1> 
      {/*<button onClick={this.test}>Test</button>*/}
      <p>{this.state.tt}</p>

      <div id="course_info_table">
        <table id="course-info-table">
          <tr>
            <th>Student Id</th>
            <th>First Name</th>
            <th>Surname</th>
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
	return <ViewClass navigate={navigate} />;
}