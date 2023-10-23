/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import Author from "components/Table/Author";

export default function data(loanData) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (loanData) {
      const list = loanData.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          type: <Author name={item.type} />,
          name: <Author name={`${item.firstName} ${item.lastName}`} />,
          email: <Author name={item.email} style={{ textTransform: "normal" }} />,
          phone: <Author name={item.mobileNumber} />,
          pinCode: <Author name={item.pinCode} />,
          loanAmount: <Author name={item.loanAmount} />,
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [loanData]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      { Header: "Type", accessor: "type", width: "10%" },
      { Header: "Name", accessor: "name", width: "10%" },
      { Header: "Email", accessor: "email", width: "10%" },
      { Header: "Phone", accessor: "phone", width: "10%" },
      { Header: "Pin code", accessor: "pinCode", width: "10%" },
      { Header: "Loan Amount", accessor: "loanAmount", width: "10%" },
    ],
    rows,
  };
}
