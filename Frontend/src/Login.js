import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password
    };

    try {
      const response = await axios.post('http://localhost:3000', userData);
      if(response.data.login){
        console.log("Login Successful");
      } else {
        console.log("Invalid Username/Password");
      }
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type='submit' value='Login' />
      </form>
    </div>
  );
}

export default Login;
