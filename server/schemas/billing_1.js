import mongoose from "mongoose"

const billing = new mongoose.Schema({
  ID: Number,
  MESSAGE_ID: Number,
  USER_ID: Number,
  DEVICE_ID: Number,
  STATUS: Number,
  STATUS_DATE: Date,
  STATUS_TIME: Date,
  DEVICE_VALUE: String,
  PROVIDER_ID: Number,
})

billing.index({ USER_ID: 1 })
billing.index({ DEVICE_ID: 1 })
billing.index({ STATUS_DATE: 1 })

const Billing = mongoose.model("billing_1", billing)
export default Billing
