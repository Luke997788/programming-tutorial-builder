import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Navigate, useNavigate, Link } from "react-router-dom"
import './LoginForm.css';
import Homepage from './Homepage';

class LoginForm extends Component {
  
  state = {
    response: '',
    username: '',
    password: '',
    responseToPost: '',
    loggedIn: 'false',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  componentDidUpdate() {
    const status = sessionStorage.getItem('username');

    if (status) {
      this.props.navigate("/home");
    }
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
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.username, password: this.state.password }),
    });
    const body = await response.text();

    if (body === 'teacher') {
      this.setState({ responseToPost: body, loggedIn: 'true' });
      sessionStorage.setItem("loggedIn", true);
      sessionStorage.setItem("username", this.state.username);
      sessionStorage.setItem("role", "teacher");
      this.props.navigate("/home");
    } else if (body === 'student') {
      this.setState({ responseToPost: body, loggedIn: 'true' });
      sessionStorage.setItem("loggedIn", true);
      sessionStorage.setItem("username", this.state.username);
      sessionStorage.setItem("role", "student");
      this.props.navigate("/studenthome");
    } else {
      this.setState({ responseToPost: 'ERROR: login failed' });
    }
  };
  
render() {
    const {navigate} = this.props;

    return (
      <div id="login-container">
        <p>{this.state.response}</p>
        <form id="login-form" onSubmit={this.handleSubmit}>

          <div id="username-input-container">
            <label for="username">Username</label>
            <input type="text" id="username" value={this.state.username} onChange={e => this.setState({ username: e.target.value })}/>
          </div>

          <div id="password-input-container">
            <label for="password">Password</label>
            <input type="password" id="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/><br></br>
          </div>

          <div id="submit-button-container">
            <input type="submit" id="submit-button" value="Login"/>
          </div>

        </form>
        <p>{this.state.responseToPost}</p>
        <p>{this.state.loggedIn}</p>
        <button onClick={() => navigate("/home")}>test</button>
      </div>
    );
  }
}

export default function(props) {
  const navigate = useNavigate();

  return <LoginForm navigate={navigate} />;

}

//export default LoginForm;
