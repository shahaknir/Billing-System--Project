import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import login from "./routes/login.js"
import userBilling from "./routes/userBilling.js"
import userDetails from "./routes/userDetails.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use(cors())
app.use("/login", login)
app.use("/user-billing", userBilling)
app.use("/user-details", userDetails)

// Connect to MongoDB using mongoose

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://sean-root:SeanSeanTele@app.nonly3s.mongodb.net/app?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error}`)
    process.exit(1)
  }
}

connectDB()

// app listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// handle exception
process.on("uncaughtException", (err) => {
  console.log(err)
})
