import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  USER_ID: Number,
  user_name: String,
  first_name: String,
  last_name: String,
  email: String,
  mobile: Number,
})
userSchema.index({ USER_ID: 1 })

const User = mongoose.model("user_profiles", userSchema)
export default User
