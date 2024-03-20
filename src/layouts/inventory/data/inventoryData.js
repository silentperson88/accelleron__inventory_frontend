/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import moment from "moment";
import Author from "components/Table/Author";

export default function data(inventoryList) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (inventoryList.list) {
      console.log("inventoryList", inventoryList);
      const list = inventoryList.list.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          asselyId: <Author name={item?.assly_id} />,
          assemblyDrawningRevision: <Author name={item?.assembly_drawing_revision} />,
          description: <Author name={item?.desc} />,
          machId: <Author name={item?.mach_id} />,
          matchiningDrawingRevision: <Author name={item?.machining_drawing_revision} />,
          desc: <Author name={item?.desc} />,
          qty: <Author name={item?.qty} />,
          storageLocation: <Author name={item?.storage_location} />,
          dateOfPacking: (
            <Author
              name={
                item?.date_of_packing
                  ? moment(item?.date_of_packing).format("DD-MM-YYYY hh:mm A")
                  : ""
              }
            />
          ),
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [inventoryList]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      { Header: "ASSLY ID", accessor: "asselyId", align: "left" },
      { Header: "Assembly Drawing REVISION", accessor: "assemblyDrawningRevision", align: "left" },
      { Header: "MACH. ID", accessor: "machId", align: "left" },
      {
        Header: "Machining  Drawing  REVISION",
        accessor: "matchiningDrawingRevision",
        width: "13%",
        align: "left",
      },
      { Header: "DESC", accessor: "desc", width: "13%", align: "left" },
      { Header: "QTY", accessor: "qty", width: "13%", align: "left" },
      { Header: "STORAGE LOCATION", accessor: "storageLocation", width: "13%", align: "left" },
      { Header: "DATE OF PACKING", accessor: "dateOfPacking", width: "13%", align: "left" },
    ],
    rows,
  };
}
