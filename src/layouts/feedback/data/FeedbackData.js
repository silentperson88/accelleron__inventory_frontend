/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import moment from "moment";
import Author from "components/Table/Author";

export default function data(feedbackList) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (feedbackList) {
      const list = feedbackList.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          type: <Author name={item?.type} />,
          subject: <Author name={item?.subject} />,
          description: <Author name={item?.description} />,
          submittedBy: (
            <Author name={`${item?.createdBy?.firstName} ${item?.createdBy?.lastName}`} />
          ),
          submittedDate: <Author name={moment(item?.createdAt).format("DD-MM-YYYY hh:mm A")} />,
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [feedbackList]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      { Header: "Type", accessor: "type", align: "left" },
      { Header: "Subjects", accessor: "subject", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Submitted By", accessor: "submittedBy", width: "13%", align: "left" },
      { Header: "Submitted Date", accessor: "submittedDate", width: "13%", align: "left" },
    ],
    rows,
  };
}
