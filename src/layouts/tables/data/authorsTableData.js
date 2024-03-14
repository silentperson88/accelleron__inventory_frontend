export default function data(data) {
  const excelData = data.map((sheetData, i) => {
    const { _id, __v, ...excelSheetData } = sheetData;
    const formattedDate =
      sheetData &&
      sheetData?.date_of_packing &&
      sheetData?.date_of_packing.split("T")[0].split("-").reverse().join("-");
    return {
      no: (i = i + 1),
      assly_id: sheetData?.assly_id,
      assembly_drawing_revision: sheetData?.assembly_drawing_revision,
      mach_id: sheetData?.mach_id,
      machining_drawing_revision: sheetData?.machining_drawing_revision,
      desc: sheetData?.desc,
      qty: sheetData?.qty,
      storage_location: sheetData?.storage_location,
      date_of_packing: formattedDate,
    };
  });

  return {
    columns: [
      { Header: "Sr. No.", accessor: "no", width: "10%", align: "left" },
      { Header: "ASSLY ID", accessor: "assly_id", align: "left" },
      { Header: "Assembly Drawing REVISION", accessor: "assembly_drawing_revision", align: "left" },
      { Header: "MACH. ID", accessor: "mach_id", align: "left" },
      {
        Header: "Machining Drawing REVISION",
        accessor: "machining_drawing_revision",
        align: "left",
      },
      { Header: "DESC", accessor: "desc", align: "left" },
      { Header: "QTY", accessor: "qty", align: "left" },
      { Header: "STORAGE LOCATION", accessor: "storage_location", align: "left" },
      { Header: "DATE OF PACKING (DD/MM/YYYY)", accessor: "date_of_packing", align: "left" },
    ],

    rows: excelData,
  };
}
