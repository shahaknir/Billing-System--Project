import React, { useEffect, useMemo, useState } from "react"
import Table from "../components/Table"
import DataTable from "react-data-table-component"
import { columns } from "../dummydata/tableData"
import axios from "axios"
import { API_URL } from "../utils/api"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"
import DeviceUsageChart from "../components/DeviceUsageChart"
import { getCurrentMonthMessages, getDeviceUsage } from "../service/analysis"
import Modal from "../components/Modal"
import MessageCountCard from "../components/MessagesCountCard"

export default function UserDetail() {
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [messagesCount, setMessagesCount] = useState(0)
  const user = secureLocalStorage.getItem(AUTH_USER)
  const isAdmin = user === "admin" ? true : false
  const [showDeviceUsageModal, setShowDeviceUsageModal] = useState(false)
  const [deviceLoading, setDeviceLoading] = useState(false)
  const [deviceData, setDeviceData] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUserDetails = async (page, size = perPage) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/user-details`, {
        page: page,
        per_page: size,
        id: user?.USER_ID,
      })
      setData(response.data.userDevices)
      setTotalRows(response.data.total)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDeviceUsage = async (row) => {
    setDeviceLoading(true)
    try {
      const response = await getDeviceUsage(row.ID)
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
        name: "DEVICE ID",
        selector: (row, index) => row.ID,
        cell: (row, index) => (
          <span
            onClick={() => {
              !isAdmin && handleDeviceClick(row)
            }}
            className={!isAdmin ? "cursor-pointer clickable-cell" : ""}
          >
            {row.ID}
          </span>
        ),
        sortable: true,
      },

      {
        name: "TYPE",
        selector: (row) => row.TYPE,
        sortable: true,
      },
      {
        name: "SUB_TYPE",
        selector: (row) => row.SUB_TYPE,
        sortable: true,
      },
      {
        name: "VALUE",
        selector: (row) => row.VALUE,
        sortable: true,
      },
    ],
    []
  )

  const fetchMessages = async () => {
    setMessagesLoading(true)
    try {
      const response = await getCurrentMonthMessages(
        isAdmin ? undefined : user?.USER_ID
      )
      setMessagesCount(response.messagesCount)
      setMessagesLoading(false)
    } catch (error) {
      console.log(error)
      setMessagesLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
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
    <>
      {!isAdmin && (
        <div className=" ml-auto mr-auto  mt-5 py-5  w-1/4">
          <MessageCountCard
            messageCount={messagesCount}
            loading={messagesLoading}
          />
        </div>
      )}
      <div className="flex items-end">
        <div className="w-[80%] h-[80vh] ml-auto mr-auto border mt-5 py-5">
          <DataTable
            title={"User Details"}
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
            // actions={
            //   <>
            //     <button className="h-full border-2 py-3 px-8 my-2 rounded-md bg-blue-700 text-[16px] text-white hover:text-black hover:bg-white hover:border-blue-700 transition">
            //       EXPORT PDF
            //     </button>
            //   </>
            // }
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
      </div>
    </>
  )
}
