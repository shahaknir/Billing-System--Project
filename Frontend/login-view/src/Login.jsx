import React, {useState} from "react"
export const Login = () => {
    const [Email, setEmail] = useState('');
    const [password, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(Email);

    }

    return (
       <div className="auth-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input value={Email} onChange={(e) => setEmail(e.target.value)} type="Email" placeholder="Name@Mail-Domain.com" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPass(e.target.value)} type="Password" placeholder="******" id="password" name="password" />
            <button>Log In</button>
        </form>
        </div> 
    )
}