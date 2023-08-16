import "./App.css"
import React, { useContext, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import UserDetail from "./pages/UserDetail"
import UserSummary from "./pages/UserSummary"
import Billing from "./pages/Billing"
import { useState } from "react"
import AuthLayout from "./layout/AuthLayout"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "./utils/storage"

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const user = secureLocalStorage.getItem(AUTH_USER)

  useEffect(() => {
    if (user) {
      setIsLogin(true)
      setLoading(false)
    } else {
      setIsLogin(false)
      setLoading(false)
    }
  }, [user])

  return (
    <>
      {loading ? (
        <h1 className="text-5xl text-center">Loading...</h1>
      ) : (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isLogin ? (
                  <Navigate to={"/dashboard"} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
            <Route
              path="/dashboard"
              element={
                <AuthLayout>
                  <Dashboard setIsLogin={setIsLogin} />
                </AuthLayout>
              }
            >
              <Route path="" element={<UserDetail />} />
              <Route path="usersummary" element={<UserSummary />} />
              <Route path="billing" element={<Billing />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  )
}

export default App
