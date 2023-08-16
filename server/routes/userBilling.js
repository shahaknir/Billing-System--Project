import express from "express"
import Billing from "../schemas/billing_1.js"
import User from "../schemas/user-profile.js"
import pdf from "html-pdf"
import moment from "moment"

const router = express.Router()

// USER BILLING
router.post("/", async (req, res) => {
  try {
    const { page, per_page, id } = req.body
    const startOfMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toISOString()
    const endOfMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .toISOString()

    if (!id) {
      // Query for retrieving billing data within the previous month
      const query = {
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
      }
      const totalDocuments = await Billing.countDocuments(query)

      const billingList = await Billing.find(query)
        .skip((parseInt(page) - 1) * parseInt(per_page))
        .limit(parseInt(per_page))

      res.status(200).json({
        userMessages: billingList,
        total: totalDocuments,
      })
      return
    }

    const query = {
      USER_ID: id,
      $or: [
        {
          $and: [
            { STATUS_DATE: { $gte: startOfMonth, $lte: endOfMonth } },
            { STATUS_DATE: { $type: "date" } },
          ],
        },
        {
          $and: [
            { STATUS_TIME: { $gte: startOfMonth, $lte: endOfMonth } },
            { STATUS_TIME: { $type: "date" } },
          ],
        },
      ],
    }

    const totalDocuments = await Billing.countDocuments(query)

    const billingList = await Billing.find(query)
      .skip((parseInt(page) - 1) * parseInt(per_page))
      .limit(parseInt(per_page))

    res.status(200).json({
      userMessages: billingList,
      total: totalDocuments,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({
      msg: "Server Error",
    })
  }
})

// Generate bill in PDF format for a specific user
router.get("/generate-bill/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const startOfMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toISOString()
    const endOfMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .toISOString()
    const query = {
      USER_ID: userId,
      $or: [
        {
          $and: [
            { STATUS_DATE: { $gte: startOfMonth, $lte: endOfMonth } },
            { STATUS_DATE: { $type: "date" } },
          ],
        },
        {
          $and: [
            { STATUS_TIME: { $gte: startOfMonth, $lte: endOfMonth } },
            { STATUS_TIME: { $type: "date" } },
          ],
        },
      ],
    }
    // Fetch billing data from MongoDB for the specified user within the previous month
    const billingData = await Billing.find(query)
    const userInfo = await User.findOne({ USER_ID: userId })

    if (billingData.length === 0) {
      return res
        .status(404)
        .json({ error: "No billing data found for the user." })
    }

    // Generate HTML content for the bill
    const htmlContent = generateHTMLBill(billingData, userInfo)

    // Generate PDF from the HTML content
    pdf.create(htmlContent).toStream((err, stream) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: "Failed to generate PDF bill." })
      }
      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", 'attachment; filename="bill.pdf"')
      // Pipe the PDF stream to the response
      stream.pipe(res)
    })
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({ error: "An error occurred while generating the bill." })
  }
})

// USER SUMMARY
router.post("/summary", async (req, res) => {
  try {
    const { page, per_page, id } = req.body
    const startOfMonth = moment().startOf("month").toISOString()
    const endOfMonth = moment().endOf("month").toISOString()

    if (!id) {
      // Query for retrieving billing data within the current month
      const totalDocuments = await Billing.countDocuments({
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

      const billingList = await Billing.find({
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
        .skip((parseInt(page) - 1) * parseInt(per_page))
        .limit(parseInt(per_page))

      res.status(200).json({
        userMessages: billingList,
        total: totalDocuments,
      })
      return
    }

    const query = {
      USER_ID: id,
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
    }

    const totalDocuments = await Billing.countDocuments(query)
    const billingList = await Billing.find(query)
      .skip((parseInt(page) - 1) * parseInt(per_page))
      .limit(parseInt(per_page))

    res.status(200).json({
      userMessages: billingList,
      total: totalDocuments,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({
      msg: "Server Error",
    })
  }
})

// Generate HTML content for the bill
function generateHTMLBill(billingData, userInfo) {
  let htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Monthly Bill</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }

          h1, h3 {
            text-align: center;
            margin: 20px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid black;
            padding: 10px;
          }

          th {
            font-weight: bold;
            font-size: 20px;
          }

          tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .total {
            float: right;
            font-weight: bolder;
          }
        </style>
      </head>
      <body>
        <h1>Monthly Bill</h1>
        <h3>USER_ID: ${userInfo?.USER_ID}</h3>
        <h3>User Name: ${userInfo?.user_name}</h3>
        <table>
          <tr>
            <th>Device ID</th>
            <th>Message ID</th>
            <th>Device Value</th>
            <th >Cost</th>
          </tr>
       
  `

  let totalCost = 0
  let deviceGroup = {}

  billingData.forEach((billing) => {
    const { DEVICE_ID, MESSAGE_ID, DEVICE_VALUE } = billing
    const cost = 10
    totalCost += cost

    if (deviceGroup[DEVICE_ID]) {
      deviceGroup[DEVICE_ID].messages.push(MESSAGE_ID)
    } else {
      deviceGroup[DEVICE_ID] = {
        deviceValue: DEVICE_VALUE,
        messages: [MESSAGE_ID],
      }
    }
  })

  for (let deviceId in deviceGroup) {
    const { deviceValue, messages } = deviceGroup[deviceId]

    htmlContent += `
      <tr>
        <td rowspan="${messages.length}">${deviceId}</td>
        <td>${messages[0]}</td>
        <td>${deviceValue}</td>
        <td rowspan="${messages.length}">$${(
      messages.length * 10
    ).toLocaleString()}</td>
      </tr>
    `

    for (let i = 1; i < messages.length; i++) {
      htmlContent += `
        <tr>
          <td>${messages[i]}</td>
          <td>${deviceValue}</td>
        </tr>
      `
    }
  }

  htmlContent += `
          <tr style="background-color : white ;">
            <td colspan="2" style="background-color : white ; border : none;"></td>
            <td colspan="2"  style="text-align : center; font-weight : bold; ">Total: $${totalCost.toLocaleString()}</td>
          </tr>
        </table>
      </body>
    </html>
  `

  return htmlContent
}

export default router
