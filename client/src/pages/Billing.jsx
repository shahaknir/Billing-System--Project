import React, { useEffect, useMemo, useState } from "react"
import Table from "../components/Table"
import secureLocalStorage from "react-secure-storage"
import { AUTH_USER } from "../utils/storage"
import { API_URL } from "../utils/api"
import axios from "axios"
import DataTable from "react-data-table-component"
import moment from "moment"
export default function Billing() {
  const user = secureLocalStorage.getItem(AUTH_USER)
  const [data, setData] = useState([])
  const [exporting, setExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUserDetails = async (page, size = perPage) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/user-billing`, {
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
        sortable: true,
      },
      {
        name: "DEVICE_ID",
        selector: (row) => row.DEVICE_ID,
        sortable: true,
      },
      // {
      //   name: "DEVICE_VALUE",
      //   selector: (row) => row.DEVICE_VALUE,
      //   sortable: true,
      // },
      {
        name: "STATUS_TIME",
        selector: (row) => row.STATUS_TIME,
        cell: (row) => (
          <span>{moment(row.STATUS_TIME).format("DD/MM/YYYY HH:mm")}</span>
        ),
        sortable: true,
      },
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
  const handleGenerate = () => {
    setExporting(true)
    const userId = secureLocalStorage.getItem(AUTH_USER)
    axios
      .get(`${API_URL}/user-billing/generate-bill/${userId.USER_ID}`, {
        responseType: "blob",
      })
      .then((response) => response.data)
      .then((blob) => {
        const blobPdf = new Blob([blob], { type: "application/pdf" })
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blobPdf)
        link.download = `${userId.user_name}_bill.pdf`
        link.click()
        setExporting(true)
        setExporting(false)
      })
      .catch((error) => {
        console.error(error)
        setExporting(false)
      })
  }
  return (
    <div className="flex items-end">
      <div className="w-[80%] h-[80vh] ml-auto mr-auto border mt-5 py-5">
        <DataTable
          title={"User Billing"}
          columns={columns}
          data={data}
          progressPending={loading}
          data-tag="allowRowEvents"
          pagination
          paginationServer
          // No data found message
          noDataComponent={
            <div className="text-center">
              No messages found in previous month
            </div>
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
          actions={
            <>
              {user === "admin" ? (
                ""
              ) : data?.length ? (
                <button
                  onClick={handleGenerate}
                  className="h-full border-2 py-3 px-8 my-2 rounded-md bg-blue-700 text-[16px] text-white hover:text-black hover:bg-white hover:border-blue-700 transition"
                >
                  {exporting ? "EXPORTING..." : "EXPORT PDF"}
                </button>
              ) : null}
            </>
          }
        />
      </div>
    </div>
  )
}
