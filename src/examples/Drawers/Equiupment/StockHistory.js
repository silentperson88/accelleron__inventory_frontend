import React, { useEffect, useState } from "react";

// Components
import Author from "components/Table/Author";

export default function stockHistoy(StockHistory) {
  const [stocksRow, setStocksRow] = useState([]);

  useEffect(() => {
    if (StockHistory) {
      const tempRows = Array.from(
        { length: 30 },
        (_, index) => StockHistory[index % StockHistory.length]
      ).map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          date: <Author name={element?.date} />,
          orderType: <Author name={element?.orderType} />,
          quantity: <Author name={element?.quantity} />,
          stocks: <Author name={element?.stocks} />,
          remarks: <Author name={element?.remarks} />,
        };
        return temp;
      });
      setStocksRow([...tempRows]);
    }
  }, [StockHistory]);
  return {
    stocksColumns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      { Header: "Date", accessor: "date", align: "left" },
      { Header: "Order Type", accessor: "orderType", align: "left" },
      { Header: "Quantity", accessor: "quantity", align: "left" },
      { Header: "Stocks", accessor: "stocks", align: "left" },
      { Header: "Remarks", accessor: "remarks", align: "left" },
    ],
    stocksRow,
  };
}
