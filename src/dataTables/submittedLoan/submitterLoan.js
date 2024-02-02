/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import Author from "components/Table/Author";
import MDBox from "components/MDBox";
import { IconButton } from "@mui/material";
import { Icons } from "utils/Constants";

export default function data(loanData, handleEditModal) {
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
          status: <Author name={item?.status} />,
          sourceOfLead: <Author name={item?.sourceOfLead} />,
          imd: <Author name={item?.imd} />,
          bank: <Author name={item?.bank?.bankName} />,
          code: <Author name={item?.Code?.code} />,
          action: (
            <MDBox>
              <IconButton
                fontSize="medium"
                sx={{ cursor: "pointer", color: "#475467" }}
                onClick={() => handleEditModal(item)}
              >
                {Icons.EDIT2}
              </IconButton>
            </MDBox>
          ),
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
      { Header: "Status", accessor: "status", width: "10%" },
      { Header: "Source of Lead", accessor: "sourceOfLead", width: "10%" },
      { Header: "IMD", accessor: "imd", width: "10%" },
      { Header: "Bank", accessor: "bank", width: "10%" },
      { Header: "Code", accessor: "code", width: "10%" },
      { Header: "Action", accessor: "action", width: "10%" },
    ],
    rows,
  };
}
