export default function data(data) {
  const excelData = data.map((sheetData, i) => {
    return {
      no: (i = i + 1),
      speciality: sheetData?.speciality,
      name: sheetData?.name,
      email: sheetData?.email,
      about: sheetData?.about,
    };
  });

  return {
    columns: [
      { Header: "No", accessor: "no", width: "40%", align: "left" },
      { Header: "speciality", accessor: "speciality", align: "left" },
      { Header: "name", accessor: "name", align: "left" },
      { Header: "email", accessor: "email", align: "left" },
      { Header: "about", accessor: "about", align: "left" },
    ],

    rows: excelData,
  };
}
