import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

const DeviceUsageChart = ({ sortedGroupedData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="chart-loader">
        <div className="spinner"></div>
      </div>
    )
  }

  const labels = Object.keys(sortedGroupedData)

  const data = labels.map(
    (month) => sortedGroupedData[month]?.data?.length || 0
  )

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Device Usage",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return <Bar data={chartData} options={chartOptions} />
}

export default DeviceUsageChart
