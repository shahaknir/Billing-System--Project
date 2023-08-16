import React from "react"
import { Link, useNavigate } from "react-router-dom"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"

export default function Navbar({ setIsLogin }) {
  const navigate = useNavigate()
  const handleLogout = () => {
    setIsLogin(false)
    secureLocalStorage.removeItem(AUTH_USER)
    navigate("/login")
  }

  return (
    <div className="shadow h-[10vh] flex items-center">
      <div className="flex items-center justify-between w-full px-10">
        <Link
          to={"/dashboard"}
          className="text-3xl text-green-600 cursor-pointer"
        >
          Message
        </Link>
        <nav className="flex gap-5 items-center">
          <Link className="nav-link" to="">
            Detail
          </Link>
          <Link className="nav-link" to="usersummary">
            Summary
          </Link>
          <Link className="nav-link" to="billing">
            Billing
          </Link>
          <button
            onClick={() => {
              handleLogout()
            }}
            className="px-5 py-2 border bg-blue-700 text-white rounded hover:bg-blue-600 transition"
          >
            LOGOUT
          </button>
        </nav>
      </div>
    </div>
  )
}
