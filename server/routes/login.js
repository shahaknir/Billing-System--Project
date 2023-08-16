import express from "express"
import User from "../schemas/user-profile.js"

const router = express.Router()

// Route to authenticate a user
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body
    let passwordInt = parseInt(password)

    // Find the user in MongoDB
    const user = await User.findOne({
      user_name: username,
      mobile: passwordInt,
    })

    if (!user) {
      // User not found
      return res.status(404).json({ error: "User not found" })
    }

    // User found, send user details and user ID in the response
    res.status(200).json({
      user,
      user_id: user.USER_ID,
    })
  } catch (error) {
    console.log(error)

    // Internal server error
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export default router
