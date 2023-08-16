import mongoose, { Schema } from "mongoose"

const userDevice = new mongoose.Schema({
  USER_ID: Number,
  ID: Number,
  TYPE: Number,
  SUB_TYPE: Number,
  VALUE: [Schema.Types.Mixed],
})

userDevice.index({ USER_ID: 1 })

const UserDeivce = mongoose.model("user_device", userDevice, "user_device")
export default UserDeivce
