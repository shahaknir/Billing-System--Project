import express from "express"
import moment from "moment"

import UserDevice from "../schemas/user-device.js"
import Billing from "../schemas/billing_1.js"

const router = express.Router()

// Get user devices with pagination
router.post("/", async (req, res) => {
  try {
    const { page, per_page, id } = req.body

    if (!id) {
      const totalDocuments = await UserDevice.countDocuments()

      const summaries = await UserDevice.find()
        .skip((parseInt(page) - 1) * parseInt(per_page))
        .limit(parseInt(per_page))

      res.status(200).json({
        userDevices: summaries,
        total: totalDocuments,
      })
      return
    }

    const totalDocuments = await UserDevice.countDocuments({ USER_ID: id })

    const summaries = await UserDevice.find({ USER_ID: id })
      .skip((parseInt(page) - 1) * parseInt(per_page))
      .limit(parseInt(per_page))

    res.status(200).json({
      userDevices: summaries,
      total: totalDocuments,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      msg: "Server Error",
    })
  }
})

// Get the count of messages for the current month
router.get("/count-messages/:id", async (req, res) => {
  try {
    // Construct the start and end of the current month
    const startOfMonth = moment().startOf("month").toISOString()
    const endOfMonth = moment().endOf("month").toISOString()
    const USER_ID = req.params.id

    var currentMonthBillingDataCount
    if (USER_ID !== "undefined" && USER_ID) {
      currentMonthBillingDataCount = await Billing.countDocuments({
        USER_ID: USER_ID,
        $or: [
          {
            $and: [
              { STATUS_DATE: { $gte: startOfMonth, $lte: endOfMonth } },
              { STATUS_DATE: { $type: "date" } },
            ],
          },
          {
            $or: [
              { STATUS_TIME: { $gte: startOfMonth, $lte: endOfMonth } },
              { STATUS_TIME: { $type: "date" } },
            ],
          },
        ],
      })
    } else {
      currentMonthBillingDataCount = await Billing.countDocuments({
        $or: [
          {
            $and: [
              { STATUS_DATE: { $gte: startOfMonth, $lte: endOfMonth } },
              { STATUS_DATE: { $type: "date" } },
            ],
          },
          {
            $or: [
              { STATUS_TIME: { $gte: startOfMonth, $lte: endOfMonth } },
              { STATUS_TIME: { $type: "date" } },
            ],
          },
        ],
      })
    }

    res.status(200).json({
      messagesCount: currentMonthBillingDataCount,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "An error occurred" })
  }
})

// Get client device usage
router.get("/client-device-usage/:id", async (req, res) => {
  try {
    const USER_ID = req.params.id
    const summaries = await UserDevice.find({ USER_ID: USER_ID })
    const totalDocuments = await UserDevice.countDocuments({ USER_ID: USER_ID })

    // Get billing data count for each device
    const userDevices = await Promise.all(
      summaries.map(async (device) => {
        const billingDataCount = await Billing.countDocuments({
          DEVICE_ID: device.ID,
          USER_ID: USER_ID,
        })
        const percentageUsage = (billingDataCount / totalDocuments) * 100
        return {
          _id: device._id,
          USER_ID: device.USER_ID,
          ID: device.ID,
          TYPE: device.TYPE,
          SUB_TYPE: device.SUB_TYPE,
          VALUE: device.VALUE,
          billingDataCount: billingDataCount,
          percentageUsage: percentageUsage.toFixed(2),
        }
      })
    )

    res.status(200).json({
      userDevices: userDevices,
      total: totalDocuments,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "An error occurred" })
  }
})

// Get device usage
router.get("/device-usage/:id/:userID", async (req, res) => {
  try {
    const DEVICE_ID = req.params.id
    const USER_ID = req.params.userID
    // const DEVICE_ID = 2533003401
    const query = {
      DEVICE_ID: DEVICE_ID,
      USER_ID: USER_ID,
    }
    const summaries = await Billing.find(query)
    const totalDocuments = await Billing.countDocuments(query)

    const groupedData = summaries.reduce((result, item) => {
      // Check if STATUS_TIME or STATUS_DATE is valid
      var myDate

      if (moment(item.STATUS_TIME).isValid()) {
        myDate = item.STATUS_TIME
      } else if (moment(item.STATUS_DATE).isValid()) {
        myDate = item.STATUS_DATE
      }

      const month = moment(myDate).month()
      const monthName = moment.months()[month]

      if (!result[monthName]) {
        result[monthName] = []
      }

      result[monthName].push(item)
      return result
    }, {})

    // Sort the grouped data month-wise
    const sortedData = Object.entries(groupedData).sort((a, b) => {
      const monthA = moment().month(a[0])
      const monthB = moment().month(b[0])
      return monthA - monthB
    })

    // Output the sorted data and their lengths
    const sortedGroupedData = sortedData.reduce((result, [month, items]) => {
      result[month] = {
        data: items,
        length: items.length,
      }
      return result
    }, {})

    res.status(200).json({
      sortedGroupedData,
      devices: summaries,
      total: totalDocuments,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "An error occurred" })
  }
})

export default router
