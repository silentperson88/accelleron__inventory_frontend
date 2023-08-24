/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useEffect, useState } from "react";

// Components
import Author from "components/Table/Author";
import MDBox from "components/MDBox";
import { IconButton } from "@mui/material";
import { Icons } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import { useNavigate } from "react-router-dom";

export default function orderRequest(StockHistory) {
  const [orderRow, setOrderRow] = useState([]);
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/client/setting/order-requests/${id}`);
  };

  const CustomImage = ({ item, index, remainingLength }) => {
    // return image image when index is less than 5
    // return image with the number of more images in number when index is 5 or more
    if (index !== 4) {
      return (
        <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <img
            src={item?.url}
            alt={item?.url}
            key={item?.name}
            style={{
              width: pxToRem(50),
              height: pxToRem(50),
              marginRight: pxToRem(10),
            }}
          />
          <MDBox
            component="span"
            sx={{
              fontSize: pxToRem(12),
              fontWeight: 700,
            }}
          >
            {item.requestedQuantity}
          </MDBox>
        </MDBox>
      );
    }
    return (
      <MDBox display="flex" flexDirection="row" alignItems="center">
        <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <img
            src={item?.url}
            alt={item?.url}
            key={item?.name}
            style={{
              width: pxToRem(50),
              height: pxToRem(50),
              marginRight: pxToRem(10),
            }}
          />
          <MDBox
            component="span"
            sx={{
              fontSize: pxToRem(12),
              fontWeight: 700,
            }}
          >
            {item.requestedQuantity}
          </MDBox>
        </MDBox>
        <MDBox component="span" fontSize={pxToRem(12)} color="text.disabled">
          {remainingLength} more
        </MDBox>
      </MDBox>
    );
  };

  useEffect(() => {
    if (StockHistory) {
      const tempRows = Array.from(
        { length: 30 },
        (_, index) => StockHistory[index % StockHistory.length]
      ).map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          orderId: <Author name={element?.orderId} />,
          raisedBy: <Author name={element?.raisedBy} />,
          requestedEquipment: (
            <MDBox display="flex" flexDirection="row">
              {element?.requestedEquipment.length > 5
                ? element?.requestedEquipment
                    .slice(0, 5)
                    .map((item, imgIndex) => (
                      <CustomImage
                        item={item}
                        index={imgIndex}
                        remainingLength={
                          (element?.requestedEquipment.length &&
                            element.requestedEquipment.length - 5) ||
                          0
                        }
                      />
                    ))
                : element?.requestedEquipment.map((item, imgIndex) => (
                    <CustomImage item={item} index={imgIndex} />
                  ))}
            </MDBox>
          ),
          reqItems: <Author name={element?.reqItems} />,
          quantity: <Author name={element?.quantity} />,
          action: (
            <MDBox>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => {
                  handleView("64dcc46900f1f89f36305d7b");
                }}
              >
                {Icons.VIEW}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setOrderRow([...tempRows]);
    }
  }, [StockHistory]);
  return {
    orderColumns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      { Header: "Order #", accessor: "orderId", align: "left" },
      { Header: "Order By", accessor: "raisedBy", align: "left" },
      { Header: "Requested Equipment", accessor: "requestedEquipment", align: "left" },
      { Header: "Requested items", accessor: "reqItems", align: "center" },
      { Header: "Quantity", accessor: "quantity", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    orderRow,
  };
}
