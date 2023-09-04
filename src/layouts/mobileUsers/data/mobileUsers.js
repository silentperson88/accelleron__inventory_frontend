/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import moment from "moment";
import Author from "components/Table/Author";

export default function data(mobileUsers) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (mobileUsers) {
      const list = mobileUsers.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          name: <Author name={`${item.firstName} ${item.lastName}`} />,
          email: <Author name={item.email} style={{ textTransform: "normal" }} />,
          phone: <Author name={item.mobileNumber} />,
          zipcode: <Author name={item.zipCode} />,
          loanAmount: <Author name={item.loanAmount} />,
          employmentType: <Author name={item.employmentType} />,
          income: <Author name={item.income} />,
          pancardNumber: <Author name={item.panCardNumber} />,
          dob: <Author name={moment(item?.dateOfBirth).format("DD/MM/YYYY")} />,
          gender: <Author name={item?.gender} />,
          status: <Author name={item.isActive ? "Active" : "In Active"} />,
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [mobileUsers]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      // headers for name, email, phone, zipcode, loan amount, employment type, income, pancard number, date of birth, gender, status, action
      { Header: "Name", accessor: "name", width: "10%" },
      { Header: "Email", accessor: "email", width: "10%" },
      { Header: "Phone", accessor: "phone", width: "10%" },
      { Header: "Zipcode", accessor: "zipcode", width: "10%" },
      { Header: "Loan Amount", accessor: "loanAmount", width: "10%" },
      { Header: "Employment Type", accessor: "employmentType", width: "10%" },
      { Header: "Income", accessor: "income", width: "10%" },
      { Header: "Pancard Number", accessor: "pancardNumber", width: "10%" },
      { Header: "Date of Birth", accessor: "dob", width: "10%" },
      { Header: "Gender", accessor: "gender", width: "10%" },
      { Header: "Status", accessor: "status", width: "10%" },
    ],
    rows,
  };
}
