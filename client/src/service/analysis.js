import axios from "axios"
import { API_URL } from "../utils/api"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"

export const getDeviceUsage = async (id) => {
  try {
    const user = secureLocalStorage.getItem(AUTH_USER)
    const response = await axios.get(
      `${API_URL}/user-details/device-usage/${id}/${user?.USER_ID}`
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getClientDeviceUsage = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/user-details/client-device-usage/${id}`
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getCurrentMonthMessages = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/user-details/count-messages/${id}`
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
