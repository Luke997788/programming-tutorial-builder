import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Navigate, useNavigate } from "react-router-dom"
import './LoginForm.css';
import Homepage from './Homepage';

const response = '';
const responseToPost= '';

function componentDidMount() {
    callApi()
      .then(res => response = res.express)
      .catch(err => console.log(err));
}
  
async function callApi() {
    // starts a request
    const response = await fetch('/api/status');
    // extract JSON object from the response
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
};
  
async function handleSubmit(e, uname, pwd) {
    e.preventDefault();
    
    // starts a request, passes URL and configuration object
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: {uname}, password: {pwd} }),
    });
    const body = await response.text();

    if (body === 'success') {
      //setResponseToPost(body);
      responseToPost = body;
      ReactDOM.render(<Homepage />, document.getElementById('root'));
      //<Navigate to="/home" />;
      //this.navigate("/home")
    } else {
        //setResponseToPost('ERROR: login failed');
        responseToPost = 'ERROR: login failed';
    }
  };
  
function Login() {
    useEffect( () => {
        callApi()
        .then(res => response = res.express)
        .catch(err => console.log(err));
    })
    //const [response, setResponse] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //const [responseToPost, setResponseToPost] = useState('');

    return (
      <div id="login-container">
        <p>{response}</p>
        <form id="login-form" onSubmit={handleSubmit({username},{password})}>

          <div id="username-input-container">
            <label for="username">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)}/>
          </div>

          <div id="password-input-container">
            <label for="password">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)}/><br></br>
          </div>

          <div id="submit-button-container">
            <input type="submit" id="submit-button" value="Login"/>
          </div>

        </form>
        <p>{responseToPost}</p>
      </div>
    );
  }


export default Login;