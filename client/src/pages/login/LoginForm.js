import React, { Component } from 'react';
import { useNavigate } from "react-router-dom"
import './LoginForm.css';

class LoginForm extends Component {
  
  state = {
    username: '',
    password: '',
    responseToLoginRequest: '',
  };

  componentDidMount() {
    const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');

    // if a user is already logged in send them to the correct home page
    if (status) {
      if (role == "student") {
        this.props.navigate("/studenthome");
      } else if (role == "teacher") {
        this.props.navigate("/home");
      }
    }
  }

  componentDidUpdate() {
    const status = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');

    // if a user is already logged in send them to the correct home page
    if (status) {
      if (role == "student") {
        this.props.navigate("/studenthome");
      } else if (role == "teacher") {
        this.props.navigate("/home");
      }
    }
  }
  
  // handles the submission of the login credentials
  handleSubmit = async e => {
    e.preventDefault();
  
    const response = await fetch('/api/verifylogindetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.username, password: this.state.password }),
    });

    await response.json().then(data => {
      let id = data[0];
      let role = data[1];

      if (role === 'teacher') {
        this.setState({responseToLoginRequest: "Login Success"});
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("username", this.state.username);
        sessionStorage.setItem("role", "teacher");
        sessionStorage.setItem("teacherId", id);
        this.props.navigate("/home");
  
      } else if (role === 'student') {
        this.setState({responseToLoginRequest: "Login Success"});
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("username", this.state.username);
        sessionStorage.setItem("role", "student");
        sessionStorage.setItem("studentId", id);
        this.props.navigate("/studenthome");
      } else if(data[0] == 'failed') {
        this.setState({ responseToLoginRequest: 'Login failed. Please try again' });
      }
    });
  };
  
render() {
  // allows the navigation component to be used
    const {navigate} = this.props;

    return (
      <div id="login-container">

        <form id="login-form" onSubmit={this.handleSubmit}>

          <div id="username-input-container">
            <label id="username-label" for="username">Username</label>
            <input type="text" id="username" value={this.state.username} onChange={e => this.setState({ username: e.target.value })}/>
          </div>

          <div id="password-input-container">
            <label id="password-label" for="password">Password</label>
            <input type="password" id="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/><br></br>
          </div>

          <div id="submit-button-container">
            <input type="submit" id="submit-button" value="Login"/>
          </div>

        </form>

        <p>{this.state.responseToLoginRequest}</p>
      </div>
    );
  }
}

export default function(props) {
  const navigate = useNavigate();

  return <LoginForm navigate={navigate} />;

}

