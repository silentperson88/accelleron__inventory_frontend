/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";
import CustomCheckbox from "components/CustomCheckbox/CustomCheckbox";
import Author from "components/Table/Author";
import Constants from "utils/Constants";

export default function RoleData({ roleAggrementData, onPermissionsChange }) {
  const [rows, setRows] = useState([]);
  const permissions = [];
  const handleChange = (name, e, element) => {
    const payload = {
      agreement_id: element?.[Constants.MONGOOSE_ID],
      agreement: {
        create: name === "create" ? e.target.checked : element?.agreement?.create,
        read: name === "read" ? e.target.checked : element?.agreement?.read,
        update: name === "update" ? e.target.checked : element?.agreement?.update,
        delete: name === "delete" ? e.target.checked : element?.agreement?.delete,
      },
    };

    const index = permissions.findIndex(
      (permission) => permission.agreement_id === payload.agreement_id
    );

    if (index !== -1) {
      const existingAgreement = permissions[index].agreement;
      permissions[index].agreement = {
        ...existingAgreement,
        create: name === "create" ? e.target.checked : existingAgreement.create,
        read: name === "read" ? e.target.checked : existingAgreement.read,
        update: name === "update" ? e.target.checked : existingAgreement.update,
        delete: name === "delete" ? e.target.checked : existingAgreement.delete,
      };
    } else {
      permissions.push(payload);
    }
    if (onPermissionsChange) {
      onPermissionsChange([...permissions]);
    }
  };

  useEffect(() => {
    if (roleAggrementData) {
      const tempRows = roleAggrementData?.map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          module: <Author name={element?.accountLicence?.permission[0].name} />,
          read: (
            <CustomCheckbox
              name="read"
              defaultChecked={element?.agreement?.read}
              onChange={(e) => handleChange("read", e, element)}
            />
          ),
          write: (
            <CustomCheckbox
              name="create"
              defaultChecked={element?.agreement?.create}
              onChange={(e) => handleChange("create", e, element)}
            />
          ),
          update: (
            <CustomCheckbox
              name="update"
              defaultChecked={element?.agreement?.update}
              onChange={(e) => handleChange("update", e, element)}
            />
          ),
          delete: (
            <CustomCheckbox
              name="delete"
              defaultChecked={element?.agreement?.delete}
              onChange={(e) => handleChange("delete", e, element)}
            />
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [roleAggrementData]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%", align: "center" },
      { Header: "Module", accessor: "module", width: "30%", align: "left" },
      {
        Header: "Read",
        accessor: "read",
        align: "center",
      },
      {
        Header: "Write",
        accessor: "write",
        align: "center",
      },
      {
        Header: "Update",
        accessor: "update",
        align: "center",
      },
      {
        Header: "Delete",
        accessor: "delete",
        align: "center",
      },
    ],
    rows,
  };
}
