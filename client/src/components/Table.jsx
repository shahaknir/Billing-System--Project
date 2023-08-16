import React, { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import {
  columns as dummyColumns,
  data as dummyData,
} from "../dummydata/tableData"

export default function Table({
  title,
  data = dummyData,
  columns = dummyColumns,
}) {
  return (
    <div className="w-[80%] h-[80vh] ml-auto mr-auto border mt-5 py-5">
      <DataTable
        title={title}
        columns={columns}
        data={data}
        selectableRows
        pagination
        fixedHeader
        fixedHeaderScrollHeight="450px"
        selectableRowsHighlight
        highlightOnHover
        actions={
          <>
            <button className="h-full border-2 py-3 px-8 my-2 rounded-md bg-blue-700 text-[16px] text-white hover:text-black hover:bg-white hover:border-blue-700 transition">
              EXPORT PDF
            </button>
          </>
        }
      />
    </div>
  )
}
