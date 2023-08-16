import React from "react"
import { Navigate } from "react-router-dom"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"

const AuthLayout = (props) => {
  if (!secureLocalStorage.getItem(AUTH_USER)) {
    return <Navigate to="/login" />
  }
  return <React.Fragment>{props.children}</React.Fragment>
}

export default AuthLayout
