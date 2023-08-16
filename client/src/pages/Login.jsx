import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"

export default function Login({ setIsLogin }) {
  const user = secureLocalStorage.getItem(AUTH_USER)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({ username: "", password: ''})
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!formFields.username.trim()) {
      errors.username = "Username is required"
    }
    if (!formFields.password.trim()) {
      errors.password = "Password is required"
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormFields({ ...formFields, [name]: value })
  }

  useEffect(() => {
    if (user) {
      setIsLogin(true)
      navigate("/dashboard")
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (validateForm()) {
        if (formFields.username === "admin" && formFields.password === "1234") {
          setIsLogin(true)
          secureLocalStorage.setItem(AUTH_USER, formFields.username)
          navigate("/dashboard")
          return
        }
        const res = await axios.post(`${API_URL}/login`, formFields)
        console.log(res.data);
        if (res.status == 200) {
          setIsLogin(true)
          secureLocalStorage.setItem(AUTH_USER, res.data.user)
          navigate("/dashboard")
          return
        } else {
          console.log("not authorized")
        }
        return
      }
    } catch (error) {
      console.log(error)
      if (error.response.status == 404) {
        setError("Invalid credentials")
      } else {
        setError("Something went wrong")
      }
    }
  }

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="md:w-[30%] sm:w-[60%] p-5 py-10 border rounded-md shadow-md">
        <h3 className="text-center text-3xl mb-10">Login</h3>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex flex-col gap-1 mb-3 w-full">
            <input
              className="border outline-none rounded p-3 focus:border-2 focus:border-blue-400 transition-all"
              type="text"
              placeholder="username"
              name="username"
              value={formFields.username}
              onChange={handleChange}
            />
            {errors.username && (
              <span className="text-red-600 text-sm">{errors.username}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 mb-3 w-full">
            <input
              className="border outline-none rounded p-3 focus:border-2 focus:border-blue-400 transition-all"
              type="password"
              placeholder="password"
              name="password"
              value={formFields.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="text-red-600 text-sm">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            className="border py-2 px-5 w-[80%] border-blue-700 bg-blue-700 text-white text-bold rounded hover:bg-white hover:text-black transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
