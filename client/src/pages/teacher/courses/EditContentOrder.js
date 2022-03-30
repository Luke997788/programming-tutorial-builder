import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

class EditContentOrder extends Component {

  state = {
    title: '',
    courseId: '',
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

    this.retrieveCourseDetails().then(data => {
      this.retrieveCourseContentInformation();
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

    if (role == "teacher") {

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
      if (data[0] == 'failed') {
        this.props.navigate("/mycourses")
      }
      
      this.setState({title: data[0]});
    });
  }

  async retrieveCourseContentInformation() {
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/getcoursecontentinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator: sessionStorage.getItem("username"), idToGet: this.state.courseId}),
    });

    await response.json().then(data => {
      if (data[0] == 'failed') {
        this.props.navigate("/editcourse/" + this.state.courseId);
      } else {
        var table = document.getElementById("course-content-table");
        table.style.visibility = 'visible';
        var rowCount = 1;

        for(let i=0; i < data.length; i++) {
          let order = data[i][0];
          let contentTitle = data[i][1];
          let contentId = data[i][4];
    
          var row = table.insertRow(rowCount);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
    
          cell1.innerHTML = order;
          cell2.innerHTML = contentTitle;
    
          var upArrow = document.createElement("button");
          upArrow.innerHTML = "^";
          upArrow.onclick = () => {this.moveContentUp(order)};

          var downArrow = document.createElement("button");
          downArrow.innerHTML = "v";
          downArrow.onclick = () => {this.moveContentDown(order)};

          cell3.appendChild(upArrow);
          cell4.appendChild(downArrow);
    
          rowCount += 1;
        }
      }
    });
  }

  async moveCourseUp(order) {
    var table = document.getElementById("course-content-table");
    var courses = table.rows;
    courses[order].parentNode.insertBefore(courses[order + 1], courses[order]);

  }

  async moveCourseDown(order) {
      
}

  render () {
    const {navigate} = this.props;

    return (
      <>
      <h1>{this.state.title}</h1>
      <p>{this.state.description}</p>

      <div id="course-content-table-container">
        <table id="course-content-table">
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th></th>
            <th></th>
          </tr>
        </table>

        <p>{this.state.responseToDeletion}</p>
        <p>{this.state.responseToAnswersDeletion}</p>
      </div>
      </>

    );
  }
}

export default function(props) {
	const navigate = useNavigate();
  const params = useParams();
	return <EditContentOrder navigate={navigate} params={params} />;
}