// import React from "react"
// import { Bar } from "react-chartjs-2"

// const ClientDeviceUsageChart = ({ userDevices, isLoading }) => {
// if (isLoading) {
//   return (
//     <div className="chart-loader">
//       <div className="spinner"></div>
//     </div>
//   )
// }
//   const labels = userDevices.map((device) => device.ID)
//   const percentages = userDevices.map((device) =>
//     parseFloat(device.percentageUsage)
//   )
//   const backgroundColors = userDevices.map((device) => {
//     if (device.billingDataCount === 0) {
//       return "rgba(255, 99, 132, 0.6)" // Red color for devices with no billing data
//     } else {
//       return "rgba(75, 192, 192, 0.6)" // Green color for devices with billing data
//     }
//   })

//   const chartData = {
//     labels: labels,
//     datasets: [
//       {
//         label: "Percentage Usage",
//         data: percentages,
//         backgroundColor: backgroundColors,
//       },
//     ],
//   }

//   const chartOptions = {
//     indexAxis: "y",
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: (context) => {
//             const dataIndex = context.dataIndex
//             const device = userDevices[dataIndex]
//             return `${device.ID} -  ${device.TYPE} - ${device.VALUE}: ${device.percentageUsage}%`
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         beginAtZero: true,
//         ticks: {
//           precision: 0,
//         },
//       },
//     },
//   }

//   return <Bar data={chartData} options={chartOptions} />
// }

// export default ClientDeviceUsageChart

import React from "react"
import { Pie } from "react-chartjs-2"

const ClientDeviceUsageChart = ({ userDevices, isLoading }) => {
  if (isLoading) {
    return (
      <div className="chart-loader">
        <div className="spinner"></div>
      </div>
    )
  }
  const labels = userDevices.map((device) => {
    return ` Device ID : ${device.ID} - Message(s) : ${device.billingDataCount} -  Device Value : ${device.VALUE}`
  })
  const percentages = userDevices.map((device) =>
    parseFloat(device.percentageUsage)
  )
  const backgroundColors = userDevices.map((device) => {
    if (device.billingDataCount === 0) {
      return "rgba(255, 99, 132, 0.6)" // Red color for devices with no billing data
    } else {
      return "rgba(75, 192, 192, 0.6)" // Green color for devices with billing data
    }
  })

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: backgroundColors,
      },
    ],
  }

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex
            const device = userDevices[dataIndex]
            return `${device.ID} - ${device.VALUE}: ${device.percentageUsage}%`
          },
        },
      },
      legend: {
        display: true,
      },
    },
  }

  return <Pie data={chartData} options={chartOptions} />
}

export default ClientDeviceUsageChart
