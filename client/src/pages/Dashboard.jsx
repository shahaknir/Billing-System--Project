import { Link, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

const Dashboard = ({ setIsLogin }) => {
  return (
    <div>
      <Navbar setIsLogin={setIsLogin} />

      <Outlet />
    </div>
  )
}

export default Dashboard
