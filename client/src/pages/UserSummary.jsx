import React, { useEffect, useMemo, useState } from "react"
import Table from "../components/Table"
import DataTable from "react-data-table-component"
import { columns } from "../dummydata/tableData"
import axios from "axios"
import { API_URL } from "../utils/api"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"
import { getClientDeviceUsage, getDeviceUsage } from "../service/analysis"
import Modal from "../components/Modal"
import ClientDeviceUsageChart from "../components/ClientDeviceUsageChart"
import DeviceUsageChart from "../components/DeviceUsageChart"

export default function UserSummary() {
  const user = secureLocalStorage.getItem(AUTH_USER)
  const isAdmin = user === "admin" ? true : false
  // DEVICE
  const [showDeviceUsageModal, setShowDeviceUsageModal] = useState(false)
  const [deviceLoading, setDeviceLoading] = useState(false)
  const [deviceData, setDeviceData] = useState([])
  // CLIENT DEVICE
  const [showClientDeviceUsageModal, setShowClientDeviceUsageModal] =
    useState(false)
  const [clientDeviceLoading, setClientDeviceLoading] = useState(false)
  const [clientDeviceData, setClientDeviceData] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUserDetails = async (page, size = perPage) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/user-billing/summary`, {
        page: page,
        per_page: size,
        id: user?.USER_ID,
      })
      console.log(response)
      setData(response.data.userMessages)
      setTotalRows(response.data.total)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchClientDeviceUsage = async (row) => {
    setClientDeviceLoading(true)
    try {
      const response = await getClientDeviceUsage(row.USER_ID)
      setClientDeviceData(response?.userDevices)
      setClientDeviceLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClientDeviceClick = (row) => {
    fetchClientDeviceUsage(row)
    setShowClientDeviceUsageModal(true)
  }

  const fetchDeviceUsage = async (row) => {
    setDeviceLoading(true)
    try {
      const response = await getDeviceUsage(row.DEVICE_ID)
      console.log(response)
      setDeviceData(response?.sortedGroupedData)
      setDeviceLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeviceClick = (row) => {
    fetchDeviceUsage(row)
    setShowDeviceUsageModal(true)
  }

  const columns = useMemo(
    () => [
      {
        name: "MESSAGE_ID",
        selector: (row, index) => row.MESSAGE_ID,
        sortable: true,
      },
      {
        name: "USER_ID",
        selector: (row) => row.USER_ID,
        cell: (row) => (
          <span
            onClick={() => !isAdmin && handleClientDeviceClick(row)}
            className={!isAdmin ? "cursor-pointer clickable-cell" : ""}
          >
            {row.USER_ID}
          </span>
        ),
        sortable: true,
      },
      {
        name: "DEVICE_ID",
        selector: (row) => row.DEVICE_ID,
        cell: (row) => (
          <span
            onClick={() => !isAdmin && handleDeviceClick(row)}
            className={!isAdmin ? "cursor-pointer clickable-cell" : ""}
          >
            {row.DEVICE_ID}
          </span>
        ),
        sortable: true,
      },
      {
        name: "DEVICE_VALUE",
        selector: (row) => row.DEVICE_VALUE,
        sortable: true,
      },
      // {
      //   name: "STATUS_TIME",
      //   selector: (row) => row.STATUS_TIME,
      //   sortable: true,
      // },
      // {
      //   name: "STATUS",
      //   selector: (row) => row.STATUS,
      //   sortable: true,
      // },
      // {
      //   name: "MESSAGE COUNT",
      //   selector: (row) => row.sum,
      //   sortable: true,
      // },
    ],
    []
  )

  useEffect(() => {
    fetchUserDetails(1)
  }, [])

  const handlePageChange = (page) => {
    fetchUserDetails(page, perPage)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    setCurrentPage(1) // Reset current page to 1
    fetchUserDetails(page, newPerPage)
  }

  return (
    <div className="flex items-end">
      <div className="w-[80%] h-[80vh] ml-auto mr-auto border mt-5 py-5">
        <DataTable
          title={"User Summary"}
          columns={columns}
          data={data}
          progressPending={loading}
          data-tag="allowRowEvents"
          pagination
          paginationServer
          // No data found message
          noDataComponent={
            <div className="text-center">No Devices found for this user</div>
          }
          paginationTotalRows={totalRows}
          paginationComponentOptions={{
            noRowsPerPage: false, // Show rows per page dropdown
            rowsPerPageText: "Rows per page:",
            // Specify the available options for rows per page
            rowsPerPageOptions: [10, 20, 25, 50],
          }}
          paginationPerPage={perPage}
          paginationDefaultPage={currentPage}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>

      <Modal
        title={"Device Usage Chart"}
        showModal={showDeviceUsageModal}
        setShowModal={setShowDeviceUsageModal}
        component={
          <DeviceUsageChart
            sortedGroupedData={deviceData}
            isLoading={deviceLoading}
          />
        }
      />

      <Modal
        title={"Client-Device Usage Chart"}
        showModal={showClientDeviceUsageModal}
        setShowModal={setShowClientDeviceUsageModal}
        component={
          <ClientDeviceUsageChart
            userDevices={clientDeviceData}
            isLoading={clientDeviceLoading}
          />
        }
      />
    </div>
  )
}
