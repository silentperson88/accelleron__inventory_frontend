import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import Constants, { PageTitles, Icons, FeatureTags, ButtonTitles, Colors } from "utils/Constants";
import MDBox from "components/MDBox";
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputAdornment,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import FTextField from "components/Form/FTextField";
import CustomButton from "examples/NewDesign/CustomButton";
import NewProject from "examples/modal/NewProject/NewProject";
import MDInput from "components/MDInput";
import pxToRem from "assets/theme/functions/pxToRem";
import ViewProject from "examples/modal/ViewProject/ViewProject";
import {
  EquipmentCategoryThunk,
  EquipmentTypeThunk,
  EquipmentHSCodeThunk,
  groupCreateThunk,
  groupUpdateThunk,
  groupDeleteThunk,
  hscodeCreateThunk,
  hscodeUpdateThunk,
  hscodeDeleteThunk,
  typeCreateThunk,
  typeUpdateThunk,
  typeDeleteThunk,
  certificateListTypeThunk,
  certificateTypeCreateThunk,
  certificateTypeUpdateThunk,
  certificateTypeDeleteThunk,
  weightformListThunk,
  weightformUpdateThunk,
  weightformCreateThunk,
  weightformDeleteThunk,
  quantitytypeListThunk,
  quantitytypeCreateThunk,
  quantitytypeUpdateThunk,
  quantitytypeDeleteThunk,
  currencyunitListThunk,
  currencyunitCreateThunk,
  currencyunitUpdateThunk,
  currencyunitDeleteThunk,
} from "redux/Thunks/Equipment";
import { useDispatch } from "react-redux";
import EquipmentGroupdata from "layouts/wfmwizard/Equipment/data/EquipmentGroupData";
import EquipmentTypedata from "layouts/wfmwizard/Equipment/data/EquipmentTypeData";
import EquipmentHSCodedata from "layouts/wfmwizard/Equipment/data/EquipmentHSCodeData";
import CertificateTypedata from "layouts/wfmwizard/Equipment/data/CertificateTypeData";
import WeightFormdata from "layouts/wfmwizard/Equipment/data/WeightFormData";
import QuantityTypedata from "layouts/wfmwizard/Equipment/data/QuantityTypeData";
import CurrencyUnitdata from "layouts/wfmwizard/Equipment/data/CurrencyUnitData";
import DataTable from "examples/Tables/DataTable";
import Validators from "utils/Validations";
import { openSnackbar } from "redux/Slice/Notification";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import FDropdown from "components/Dropdown/FDropdown";
import { Feature } from "flagged";

const cardList = [
  {
    cardTitle: "Equipment Type",
    content: "Add or Update Equipment Type.",
  },
  {
    cardTitle: "Equipment Category",
    content: "Add or Update Equipment Category",
  },
  {
    cardTitle: "Currency Unit",
    content: "Add or Update Currency Unit.",
  },
  {
    cardTitle: "Weight Form",
    content: "Add or Update Weight Form.",
  },
  {
    cardTitle: "Quantity Type",
    content: "Add or Update Quantity Type.",
  },
  {
    cardTitle: "HS Code",
    content: "Add or Update HS Code.",
  },
  {
    cardTitle: "Certificate Type",
    content: "Add or Update Certificate Type.",
  },
];
function SetupEquipment() {
  const dispatch = useDispatch();
  const [next, setNext] = useState({
    group: 0,
    equiptype: 0,
    hscode: 0,
    certificatetype: 0,
  });
  const [openEquipmentGroup, setOpenEquipmentGroup] = useState(false);
  const [openEquipmentType, setOpenEquipmentType] = useState(false);
  const [openHSCode, setOpenHSCode] = useState(false);
  const [openCertificateType, setOpenCertificateType] = useState(false);
  const [openWeightForm, setOpenWeightForm] = useState(false);
  const [openQuantityType, setOpenQuantityType] = useState(false);
  const [openCurrencyUnit, setOpenCurrencyUnit] = useState(false);
  const [modalType, setModalType] = useState("New");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [deleteData, setDeleteData] = useState({ openDeleteModal: false, type: "", id: "" });
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: 10,
  });
  const [openEquipmentGroupData, setOpenEquipmentGroupData] = useState(false);
  const handleCloseEquipmentGroupData = () => {
    setOpenEquipmentGroupData(false);
    setModalType("New");
    setTablePagination({ ...tablePagination, page: 0 });
  };

  const [openEquipmentTypeData, setOpenEquipmentTypeData] = useState(false);
  const handleCloseEquipmentTypeData = () => {
    setOpenEquipmentTypeData(false);
    setModalType("New");
    setTablePagination({ ...tablePagination, page: 0 });
  };
  const [openHSCodeData, setOpenHSCodeData] = useState(false);
  const handleCloseHSCodeData = () => {
    setOpenHSCodeData(false);
    setModalType("New");
    setTablePagination({ ...tablePagination, page: 0 });
  };

  const [openCertificateTypeData, setOpenCertificateTypeData] = useState(false);
  const handleCloseCertificateTypeData = () => {
    setOpenCertificateTypeData(false);
    setModalType("New");
    setTablePagination({ ...tablePagination, page: 0 });
  };

  const [openWeightFormData, setOpenWeightFormData] = useState(false);
  const handleCloseOpenWeightFormData = () => {
    setOpenWeightFormData(false);
    setModalType("New");
  };

  const [openQuantityTypeData, setOpenQuantityTypeData] = useState(false);
  const handleCloseOpenQuantityTypeData = () => {
    setOpenQuantityTypeData(false);
    setModalType("New");
  };

  const [openCurrencyUnitData, setOpenCurrencyUnitData] = useState(false);
  const handleCloseCurrencyUnitData = () => {
    setOpenCurrencyUnitData(false);
    setModalType("New");
  };
  const [lists, setLists] = useState({
    group: [],
    equiptype: [],
    hscode: [],
    certificatetype: [],
    weightForm: [],
    quantityType: [],
    currencyUnit: [],
  });
  const [loadingStatus, setLaodingStatus] = useState({
    group: "pending",
    equiptype: "pending",
    hscode: "pending",
    certificatetype: "pending",
    weightForm: "pending",
    quantityType: "pending",
    currencyUnit: "pending",
  });
  const [editLists, setEditLists] = useState({
    group: {},
    equiptype: {},
    hscode: {},
    certificatetype: {},
    weightForm: {},
    quantityType: {},
    currencyUnit: {},
  });
  const [body, setBody] = useState({
    group: {},
    equiptype: {},
    hscode: {},
    certificatetype: {},
    weightForm: {},
    quantityType: {},
    currencyUnit: {},
  });
  const [error, setError] = useState({
    group: {},
    equiptype: {},
    hscode: {},
    certificatetype: {},
    weightForm: {},
    quantityType: {},
    currencyUnit: {},
  });
  const [dropdownData, setDropdownData] = useState({
    group: [],
    type: [],
    hscode: [],
    weightForm: [],
    quantityType: [],
    currencyUnit: [],
    price: [],
  });

  const handleCloseDeleteModal = () => setDeleteData({ openDeleteModal: false, type: "", id: "" });
  const handleDelete = (type, id) => setDeleteData({ openDeleteModal: true, type, id });
  const handleOpenDeleteModal = async () => {
    const { type, id } = deleteData;
    if (type === "group") {
      await dispatch(groupDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.EQUIPMENT_CATEGORY_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    } else if (type === "hscode") {
      await dispatch(hscodeDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.HSCODE_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    } else if (type === "equiptype") {
      await dispatch(typeDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.EQUIPMENT_TYPE_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    } else if (type === "certificatetype") {
      await dispatch(certificateTypeDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.CERTIFICATE_TYPE_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    } else if (type === "weightForm") {
      await dispatch(weightformDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.WEIGHT_FORM_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    } else if (type === "quantityType") {
      await dispatch(quantitytypeDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.QUANTITY_TYPE_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    } else if (type === "currencyUnit") {
      await dispatch(currencyunitDeleteThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.CURRENCY_UNIT_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setRefresh(!refresh);
    }
    handleCloseDeleteModal();
  };
  const handleOpenNewModal = (modal) => {
    if (modal === "Equipment Category") {
      setOpenEquipmentGroup(true);
    } else if (modal === "Equipment Type") {
      setOpenEquipmentType(true);
    } else if (modal === "HS Code") {
      setOpenHSCode(true);
    } else if (modal === "Certificate Type") {
      setOpenCertificateType(true);
    } else if (modal === "Weight Form") {
      setOpenWeightForm(true);
    } else if (modal === "Quantity Type") {
      setOpenQuantityType(true);
    } else if (modal === "Currency Unit") {
      setOpenCurrencyUnit(true);
    }
  };
  const handleViewModal = (modal) => {
    if (modal === "Equipment Category") {
      setOpenEquipmentGroupData(true);
    } else if (modal === "Equipment Type") {
      setOpenEquipmentTypeData(true);
    } else if (modal === "HS Code") {
      setOpenHSCodeData(true);
    } else if (modal === "Certificate Type") {
      setOpenCertificateTypeData(true);
    } else if (modal === "Weight Form") {
      setOpenWeightFormData(true);
    } else if (modal === "Quantity Type") {
      setOpenQuantityTypeData(true);
    } else if (modal === "Currency Unit") {
      setOpenCurrencyUnitData(true);
    }
  };
  const handleCloseNewModal = (modal) => {
    if (modal === "Equipment Category") {
      setOpenEquipmentGroup(false);
    } else if (modal === "Equipment Type") {
      setOpenEquipmentType(false);
    } else if (modal === "HS Code") {
      setOpenHSCode(false);
    } else if (modal === "Certificate Type") {
      setOpenCertificateType(false);
    } else if (modal === "Weight Form") {
      setOpenWeightForm(false);
    } else if (modal === "Quantity Type") {
      setOpenQuantityType(false);
    } else if (modal === "Currency Unit") {
      setOpenCurrencyUnit(false);
    }
    setModalType("New");
    setError({
      ...error,
      group: {},
      hscode: {},
      equiptype: {},
      certificatetype: {},
      weightForm: {},
      quantityType: {},
      currencyUnit: {},
    });
    setBody((prevBody) => ({
      ...prevBody,
      group: {},
      equiptype: {},
      hscode: {},
      certificatetype: {},
      weightForm: {},
      quantityType: {},
      currencyUnit: {},
    }));
  };
  const { groupColumns, groupRows } = EquipmentGroupdata(
    lists.group,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { typeColumns, typeRows } = EquipmentTypedata(
    lists.equiptype,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { hscodeColumns, hscodeRows } = EquipmentHSCodedata(
    lists.hscode,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { certificateColumns, certificateRows } = CertificateTypedata(
    lists.certificatetype,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { weightFormColumns, weightFormRows } = WeightFormdata(
    lists.weightForm,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { quantityTypeColumns, quantityTypeRows } = QuantityTypedata(
    lists.quantityType,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { currencyUnitColumns, currencyUnitRows } = CurrencyUnitdata(
    lists.currencyUnit,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );

  useEffect(() => {
    (async () => {
      setTablePagination({ ...tablePagination, page: 0 });
      setNext({
        group: 0,
        equiptype: 0,
        hscode: 0,
        certificatetype: 0,
      });
      const data = new URLSearchParams({
        page: 0,
        perPage: tablePagination.perPage,
      });
      const [
        groupRes,
        typeRes,
        hscodeRes,
        certificatetypeRes,
        weightFormRes,
        quantitytypeRes,
        currencyUnitRes,
      ] = await Promise.all([
        dispatch(EquipmentCategoryThunk(data)),
        dispatch(EquipmentTypeThunk(data)),
        dispatch(EquipmentHSCodeThunk(data)),
        dispatch(certificateListTypeThunk(data)),
        dispatch(weightformListThunk()),
        dispatch(quantitytypeListThunk()),
        dispatch(currencyunitListThunk()),
      ]);
      const dropdownFormat = {
        [Constants.MONGOOSE_ID]: "",
        title: "",
      };
      const getAllCategory = await dispatch(EquipmentCategoryThunk());
      const tempCategory = getAllCategory.payload.data.data.map((item) => {
        const temp = { ...dropdownFormat };
        temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
        temp.title = item.name;
        return temp;
      });
      const tempWeight = weightFormRes.payload.data.data.map((item) => {
        const temp = { ...dropdownFormat };
        temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
        temp.title = item.abbreviation;
        return temp;
      });
      const tempCurrency = currencyUnitRes.payload.data.data.map((item) => {
        const temp = { ...dropdownFormat };
        temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
        temp.title = item.symbol;
        return temp;
      });

      const tempQuantityType = quantitytypeRes.payload.data.data.map((item) => {
        const temp = { ...dropdownFormat };
        temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
        temp.title = item.name;
        return temp;
      });
      const tempHSCode = hscodeRes.payload.data.data.map((item) => {
        const temp = { ...dropdownFormat };
        temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
        temp.title = `${item.name}(${item.code})`;
        return temp;
      });
      setDropdownData({
        ...dropdownData,
        group: tempCategory,
        weightForm: tempWeight,
        quantityType: tempQuantityType,
        currencyUnit: tempCurrency,
        hscode: tempHSCode,
      });
      setLists({
        ...lists,
        group: groupRes.payload.data.data,
        equiptype: typeRes.payload.data.data,
        hscode: hscodeRes.payload.data.data,
        certificatetype: certificatetypeRes.payload.data.data,
        weightForm: weightFormRes.payload.data.data,
        quantityType: quantitytypeRes.payload.data.data,
        currencyUnit: currencyUnitRes.payload.data.data,
      });
      setLaodingStatus({
        ...loadingStatus,
        group: "fullfilled",
        equiptype: "fullfilled",
        hscode: "fullfilled",
        certificatetype: "fullfilled",
        weightForm: "fullfilled",
        quantityType: "fullfilled",
        currencyUnit: "fullfilled",
      });
    })();
  }, [dispatch, refresh]);
  useEffect(() => {
    const updatedBody = { ...body };
    if (Object.keys(editLists.group).length !== 0 && editLists.group.constructor === Object) {
      updatedBody.group = {
        name: editLists.group.name,
        abbreviation: editLists.group.abbreviation,
      };
    }
    if (
      Object.keys(editLists.equiptype).length !== 0 &&
      editLists.equiptype.constructor === Object
    ) {
      updatedBody.equiptype = {
        type: editLists.equiptype.type,
        equipmentCategory: editLists.equiptype.equipmentCategory?.[Constants.MONGOOSE_ID],
        equipmentUnit: editLists.equiptype.equipmentUnit?.[Constants.MONGOOSE_ID],
        price: editLists.equiptype.price,
        quantityType: editLists.equiptype.quantityType?.[Constants.MONGOOSE_ID],
        hsCode: editLists.equiptype?.hsCode?.[Constants.MONGOOSE_ID],
      };
    }
    if (Object.keys(editLists.hscode).length !== 0 && editLists.hscode.constructor === Object) {
      updatedBody.hscode = {
        code: editLists.hscode.code,
        name: editLists.hscode.name,
      };
    }
    if (
      Object.keys(editLists.certificatetype).length !== 0 &&
      editLists.certificatetype.constructor === Object
    ) {
      updatedBody.certificatetype = {
        title: editLists.certificatetype.title,
      };
    }
    if (
      Object.keys(editLists.weightForm).length !== 0 &&
      editLists.weightForm.constructor === Object
    ) {
      updatedBody.weightForm = {
        title: editLists.weightForm.title,
        abbreviation: editLists.weightForm.abbreviation,
      };
    }
    if (
      Object.keys(editLists.quantityType).length !== 0 &&
      editLists.quantityType.constructor === Object
    ) {
      updatedBody.quantityType = {
        name: editLists.quantityType.name,
        priceType: editLists.quantityType.priceType,
        quantityType: editLists.quantityType.quantityType,
      };
    }
    if (
      Object.keys(editLists.currencyUnit).length !== 0 &&
      editLists.currencyUnit.constructor === Object
    ) {
      updatedBody.currencyUnit = {
        name: editLists.currencyUnit.name,
        symbol: editLists.currencyUnit.symbol,
        isDefault: editLists.currencyUnit.isDefault,
      };
    }
    setBody(updatedBody);
  }, [editLists]);
  const handleChange = (event) => {
    const { name, value, id } = event.target;

    // Check if uppercase transformation is needed
    const uppercaseValue =
      id === "abbreviation" || id === "weightabbrevation" ? value.toUpperCase() : value;

    // Creating a new object for the specific field
    const updatedField = {
      ...body[name], // Preserve other properties in the field if any
      [id]: uppercaseValue, // Assuming you want to store the value with an ID
    };

    // Updating the appropriate field in the body
    setBody((prevBody) => ({
      ...prevBody,
      [name]: updatedField,
    }));
  };

  const currencyData = lists.currencyUnit;
  const defaultCurrency =
    currencyData.find((currency) => currency.isDefault)?.[Constants.MONGOOSE_ID] ?? "";

  const handleCheckboxChange = (bodyName, e) => {
    setBody({
      ...body,
      [bodyName]: {
        ...body[bodyName],
        [e.target.name]: e.target.checked,
      },
    });
  };
  const validation = (type) => {
    const { group, hscode, equiptype, certificatetype, weightForm, quantityType, currencyUnit } =
      body;
    const tempError = {};

    if (type === "group") {
      const groupTitle = Validators.validate("basic", group?.name || "");
      const abbrevationTitle = Validators.validate("basic", group?.abbreviation || "");
      if (groupTitle !== "") tempError.title = groupTitle;
      if (abbrevationTitle !== "") {
        tempError.abbreviation = abbrevationTitle;
      } else if (group?.abbreviation && group.abbreviation.length < 3) {
        tempError.abbreviation = "Equipment Nr. Abbreviation must be 3 characters long.";
      }
    } else if (type === "hscode") {
      const { name, code } = hscode || {};
      const hscodeName = Validators.validate("basic", name || "");
      const hscodeCode = Validators.validate("number", code);
      if (hscodeName !== "") tempError.name = hscodeName;
      if (hscodeCode !== "") tempError.code = hscodeCode;
      else if (code && code.length < 6) {
        tempError.code = "HS Code must contain at least 6 characters.";
      }
    } else if (type === "equiptype") {
      const typeTitle = Validators.validate("basic", equiptype?.type || "");
      const typeCategory = Validators.validate("basic2", equiptype?.equipmentCategory || "");

      const typeWeight = Validators.validate("basic2", equiptype?.equipmentUnit || "");
      const typeQuantity = Validators.validate("basic2", equiptype?.quantityType || "");
      const typeHsCode = Validators.validate("basic2", equiptype?.hsCode || "");
      if (typeTitle !== "") tempError.type = typeTitle;
      if (typeCategory !== "") tempError.equipmentCategory = typeCategory;

      if (typeWeight !== "") tempError.equipmentUnit = typeWeight;
      if (!equiptype?.price) {
        tempError.price = "Required";
      } else {
        const numericRentalPrice = parseFloat(equiptype.price);
        if (Number.isNaN(numericRentalPrice) || numericRentalPrice < 0) {
          tempError.price = "Invalid Rental Price";
        }
      }
      if (typeQuantity !== "") tempError.quantityType = typeQuantity;
      if (typeHsCode !== "") tempError.hsCode = typeHsCode;
    } else if (type === "certificatetype") {
      const certificateTitle = Validators.validate("basic", certificatetype?.title || "");
      if (certificateTitle !== "") tempError.title = certificateTitle;
    } else if (type === "weightForm") {
      const weightFormTitle = Validators.validate("basic", weightForm?.title || "");
      const abbrevationTitle = Validators.validate("basic", weightForm?.abbreviation || "");
      if (weightFormTitle !== "") tempError.title = weightFormTitle;
      if (abbrevationTitle !== "") {
        tempError.abbreviation = abbrevationTitle;
      }
    } else if (type === "quantityType") {
      const quantityTypeTitle = Validators.validate("basic", quantityType?.name || "");
      const typePrice = Validators.validate("basic2", quantityType?.priceType || "");
      const typeQuantity = Validators.validate("basic2", quantityType?.quantityType || "");

      if (quantityTypeTitle !== "") tempError.name = quantityTypeTitle;
      if (typePrice !== "") tempError.priceType = typePrice;
      if (typeQuantity !== "") tempError.quantityType = typeQuantity;
    } else if (type === "currencyUnit") {
      const currencyUnitTitle = Validators.validate("basic", currencyUnit?.name || "");
      const currencySymbolTitle = Validators.validate("basic", currencyUnit?.symbol || "");
      if (currencyUnitTitle !== "") tempError.name = currencyUnitTitle;
      if (currencySymbolTitle !== "") tempError.symbol = currencySymbolTitle;
    }
    const isValid = Object.keys(tempError).length === 0;
    setError({ ...error, [type.substring(0, 1).toLowerCase() + type.substring(1)]: tempError });
    return isValid;
  };

  const handleCreate = async (type) => {
    setLoading(true);
    const isValid = validation(type);
    if (type === "group" && isValid) {
      const res = await dispatch(groupCreateThunk(body.group));
      if (res.payload.status === 200) {
        setOpenEquipmentGroup(false);
        await dispatch(
          openSnackbar({
            message: Constants.EQUIPMENT_CATEGORY_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          group: {},
        }));
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenEquipmentGroup(false);
      }
    } else if (type === "equiptype" && isValid) {
      const { currencyUnit, ...rest } = body.equiptype;
      const currencyToUse = currencyUnit || defaultCurrency;
      const res = await dispatch(typeCreateThunk({ ...rest, currencyUnit: currencyToUse }));
      if (res.payload.status === 200) {
        setOpenEquipmentType(false);
        await dispatch(
          openSnackbar({
            message: Constants.EQUIPMENT_TYPE_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          equiptype: {},
        }));
      } else if (res.payload.status === 422) {
        const temp = { ...error };
        temp.equiptype.quantityType = res.payload.data.data.error[0].quantityType;
        setError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenEquipmentType(false);
      }
    } else if (type === "hscode" && isValid) {
      const res = await dispatch(hscodeCreateThunk(body.hscode));
      if (res.payload.status === 200) {
        setOpenHSCode(false);
        setRefresh(!refresh);
        await dispatch(
          openSnackbar({
            message: Constants.HSCODE_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setBody((prevBody) => ({
          ...prevBody,
          hscode: {},
        }));
      } else if (res.payload.status === 422) {
        const temp = { ...error };
        temp.hscode.code = res.payload.data.data.error[0].code;
        temp.hscode.name = "";
        setError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenHSCode(false);
      }
    } else if (type === "certificatetype" && isValid) {
      const res = await dispatch(certificateTypeCreateThunk(body.certificatetype));
      if (res.payload.status === 200) {
        setOpenCertificateType(false);
        await dispatch(
          openSnackbar({
            message: Constants.CERTIFICATE_TYPE_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          certificatetype: {},
        }));
      } else if (res.payload.status === false) {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenCertificateType(false);
      }
    } else if (type === "weightForm" && isValid) {
      const res = await dispatch(weightformCreateThunk(body.weightForm));
      if (res.payload.status === 200) {
        setOpenWeightForm(false);
        await dispatch(
          openSnackbar({
            message: Constants.WEIGHT_FORM_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          weightForm: {},
        }));
      } else if (res.payload.status === false) {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenWeightForm(false);
      }
    } else if (type === "quantityType" && isValid) {
      const res = await dispatch(quantitytypeCreateThunk(body.quantityType));
      if (res.payload.status === 200) {
        setOpenQuantityType(false);
        await dispatch(
          openSnackbar({
            message: Constants.QUANTITY_TYPE_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          quantityType: {},
        }));
      } else if (res.payload.status === false) {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenQuantityType(false);
      }
    } else if (type === "currencyUnit" && isValid) {
      const res = await dispatch(currencyunitCreateThunk(body.currencyUnit));
      if (res.payload.status === 200) {
        setOpenCurrencyUnit(false);
        await dispatch(
          openSnackbar({
            message: Constants.CURRENCY_UNIT_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          currencyUnit: {},
        }));
      } else if (res.payload.status === 422) {
        const temp = { ...error };
        temp.currencyUnit.isDefault = res.payload.data.data.error[0].isDefault;
        temp.currencyUnit.name = "";
        temp.currencyUnit.symbol = "";
        setError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenCurrencyUnit(false);
      }
    }
    setLoading(false);
    if (isValid) {
      setModalType("New");
    }
  };
  const handleUpdate = async (type) => {
    setLoading(true);
    const isValid = validation(type);
    if (type === "group" && isValid) {
      const res = await dispatch(
        groupUpdateThunk({ body: body.group, id: editLists.group[Constants.MONGOOSE_ID] })
      );
      if (res.payload.status === 200) {
        setOpenEquipmentGroup(false);
        await dispatch(
          openSnackbar({
            message: Constants.EQUIPMENT_CATEGORY_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          group: {},
        }));
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenEquipmentGroup(false);
      }
    } else if (type === "hscode" && isValid) {
      const res = await dispatch(
        hscodeUpdateThunk({ body: body.hscode, id: editLists.hscode[Constants.MONGOOSE_ID] })
      );
      if (res.payload.status === 200) {
        setOpenHSCode(false);
        setRefresh(!refresh);
        await dispatch(
          openSnackbar({
            message: Constants.HSCODE_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setBody((prevBody) => ({
          ...prevBody,
          hscode: {},
        }));
      } else if (res.payload.status === 422) {
        const temp = { ...error };
        temp.hscode.code = res.payload.data.data.error[0].code;
        setError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenHSCode(false);
      }
    } else if (type === "equiptype" && isValid) {
      const res = await dispatch(
        typeUpdateThunk({ body: body.equiptype, id: editLists.equiptype[Constants.MONGOOSE_ID] })
      );
      if (res.payload.status === 200) {
        setOpenEquipmentType(false);
        await dispatch(
          openSnackbar({
            message: Constants.EQUIPMENT_TYPE_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          equiptype: {},
        }));
      } else if (res.payload.status === 422) {
        const temp = { ...error };
        temp.equiptype.quantityType = res.payload.data.data.error[0].quantityType;
        setError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenEquipmentType(false);
      }
    } else if (type === "certificatetype" && isValid) {
      const res = await dispatch(
        certificateTypeUpdateThunk({
          body: body.certificatetype,
          id: editLists.certificatetype[Constants.MONGOOSE_ID],
        })
      );
      if (res.payload.status === 200) {
        setOpenCertificateType(false);
        await dispatch(
          openSnackbar({
            message: Constants.CERTIFICATE_TYPE_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          certificatetype: {},
        }));
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenCertificateType(false);
      }
    } else if (type === "weightForm" && isValid) {
      const res = await dispatch(
        weightformUpdateThunk({
          body: body.weightForm,
          id: editLists.weightForm[Constants.MONGOOSE_ID],
        })
      );
      if (res.payload.status === 200) {
        setOpenWeightForm(false);
        await dispatch(
          openSnackbar({
            message: Constants.WEIGHT_FORM_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          weightForm: {},
        }));
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenWeightForm(false);
      }
    } else if (type === "quantityType" && isValid) {
      const res = await dispatch(
        quantitytypeUpdateThunk({
          body: body.quantityType,
          id: editLists.quantityType[Constants.MONGOOSE_ID],
        })
      );
      if (res.payload.status === 200) {
        setOpenQuantityType(false);
        await dispatch(
          openSnackbar({
            message: Constants.QUANTITY_TYPE_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          quantityType: {},
        }));
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenQuantityType(false);
      }
    } else if (type === "currencyUnit" && isValid) {
      const res = await dispatch(
        currencyunitUpdateThunk({
          body: body.currencyUnit,
          id: editLists.currencyUnit[Constants.MONGOOSE_ID],
        })
      );
      if (res.payload.status === 200) {
        setOpenCurrencyUnit(false);
        await dispatch(
          openSnackbar({
            message: Constants.CURRENCY_UNIT_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setRefresh(!refresh);
        setBody((prevBody) => ({
          ...prevBody,
          currencyUnit: {},
        }));
      } else if (res.payload.status === 422) {
        const temp = { ...error };
        temp.currencyUnit.isDefault = res.payload.data.data.error[0].isDefault;
        temp.currencyUnit.name = "";
        temp.currencyUnit.symbol = "";
        setError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        setOpenCurrencyUnit(false);
      }
    }
    setLoading(false);
    setModalType("Update");
  };
  const handleTablePagination = async (key) => {
    if (key === "groupPage") {
      const data = new URLSearchParams({
        page: next.group + 1,
        perPage: tablePagination.perPage,
      });
      const res = await dispatch(EquipmentCategoryThunk(data));
      if (res.payload.status === 200) {
        setLists({
          ...lists,
          group: [...lists.group, ...res.payload.data.data],
        });
        setNext({
          ...next,
          group: res.payload.data.data.length > 0 ? next.group + 1 : next.group,
        });
      }
    } else if (key === "typePage") {
      const data = new URLSearchParams({
        page: next.equiptype + 1,
        perPage: tablePagination.perPage,
      });
      const res = await dispatch(EquipmentTypeThunk(data));
      if (res.payload.status === 200) {
        setLists({
          ...lists,
          equiptype: [...lists.equiptype, ...res.payload.data.data],
        });
        setNext({
          ...next,
          equiptype: res.payload.data.data.length > 0 ? next.equiptype + 1 : next.equiptype,
        });
      }
    } else if (key === "hsPage") {
      const data = new URLSearchParams({
        page: next.hscode + 1,
        perPage: tablePagination.perPage,
      });
      const res = await dispatch(EquipmentHSCodeThunk(data));
      if (res.payload.status === 200) {
        setLists({
          ...lists,
          hscode: [...lists.hscode, ...res.payload.data.data],
        });
        setNext({
          ...next,
          hscode: res.payload.data.data.length > 0 ? next.hscode + 1 : next.hscode,
        });
      }
    } else if (key === "certificatePage") {
      const data = new URLSearchParams({
        page: next.certificatetype + 1,
        perPage: tablePagination.perPage,
      });
      const res = await dispatch(certificateListTypeThunk(data));
      if (res.payload.status === 200) {
        setLists({
          ...lists,
          certificatetype: [...lists.certificatetype, ...res.payload.data.data],
        });
        setNext({
          ...next,
          certificatetype:
            res.payload.data.data.length > 0 ? next.certificatetype + 1 : next.certificatetype,
        });
      }
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageTitle title={PageTitles.EQUIPMENT_SETUP} />
      <Feature name={FeatureTags.SETUP_EQUIPMENT}>
        <NewProject
          title={modalType === "New" ? "New Equipment Category" : "Edit Equipment Category"}
          openNewProject={openEquipmentGroup}
          handleCloseNewProject={() => handleCloseNewModal("Equipment Category")}
          handleSave={() => (modalType === "New" ? handleCreate("group") : handleUpdate("group"))}
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <FTextField
            label="Name*"
            placeholder="Name"
            id="name"
            name="group"
            type="text"
            error={Boolean(error.group.title)}
            helperText={error.group.title}
            defaultValue={modalType === "New" ? null : editLists.group?.name}
            handleChange={handleChange}
            marginBottom={2}
          />
          <FTextField
            label="Equipment Nr. Abbreviation*"
            placeholder="Equipment Nr. Abbreviation"
            id="abbreviation"
            name="group"
            type="text"
            defaultValue={modalType === "New" ? null : editLists.group?.name}
            error={Boolean(error.group.abbreviation)}
            helperText={error.group.abbreviation}
            handleChange={handleChange}
            marginBottom={2}
          />
        </NewProject>
        <NewProject
          title={modalType === "New" ? "New Equipment Type" : "Edit Equipment Type"}
          openNewProject={openEquipmentType}
          handleCloseNewProject={() => handleCloseNewModal("Equipment Type")}
          handleSave={() =>
            modalType === "New" ? handleCreate("equiptype") : handleUpdate("equiptype")
          }
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                mt={2}
                mb={1}
                sx={{ fontSize: pxToRem(14), color: "#344054" }}
              >
                Name*
              </MDTypography>
              <MDInput
                sx={{
                  marginTop: 0,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                id="type"
                name="equiptype"
                placeholder="Name"
                error={Boolean(error.equiptype.type)}
                helperText={error.equiptype.type}
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
                fullWidth
                defaultValue={modalType === "New" ? null : editLists.equiptype?.type}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FDropdown
                label="Equipment Category*"
                id="equipmentCategory"
                name="equiptype"
                defaultValue={
                  modalType === "Update" && openEquipmentType
                    ? editLists?.equiptype?.equipmentCategory?.[Constants.MONGOOSE_ID] ?? ""
                    : ""
                }
                menu={dropdownData.group}
                error={error.equiptype.equipmentCategory}
                helperText={error.equiptype.equipmentCategory}
                handleChange={(name, value, id) => handleChange({ target: { name, value, id } })}
              />
            </Grid>
            <Grid item xs={6}>
              <FDropdown
                label="Weight Form*"
                id="equipmentUnit"
                name="equiptype"
                defaultValue={
                  modalType === "Update" && openEquipmentType
                    ? editLists?.equiptype?.equipmentUnit?.[Constants.MONGOOSE_ID] ?? ""
                    : ""
                }
                menu={dropdownData.weightForm}
                error={error.equiptype.equipmentUnit}
                helperText={error.equiptype.equipmentUnit}
                handleChange={(name, value, id) => handleChange({ target: { name, value, id } })}
              />
            </Grid>
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                mt={2}
                mb={1}
                sx={{ fontSize: pxToRem(14), color: "#344054" }}
              >
                Rental Price*
              </MDTypography>
              <MDInput
                sx={{
                  marginTop: 0,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                id="price"
                name="equiptype"
                type="number"
                placeholder="Rental Price"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MDBox sx={{ marginLeft: "-15px" }}>
                        <FDropdown
                          id="currencyUnit"
                          name="equiptype"
                          defaultValue={
                            modalType === "Update" && openEquipmentType
                              ? editLists?.equiptype?.currencyUnit?.[Constants.MONGOOSE_ID] ?? ""
                              : defaultCurrency
                          }
                          menu={dropdownData.currencyUnit}
                          handleChange={(name, value, id) =>
                            handleChange({ target: { name, value, id } })
                          }
                          marginBottom={1.5}
                          border="1px solid #FFFFFF"
                          maxWidth={pxToRem(100)}
                        />
                      </MDBox>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(error.equiptype.price)}
                helperText={error.equiptype.price}
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
                fullWidth
                defaultValue={modalType === "New" ? null : editLists.equiptype?.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FDropdown
                label="Quantity Type*"
                id="quantityType"
                name="equiptype"
                defaultValue={
                  modalType === "Update" && openEquipmentType
                    ? editLists?.equiptype?.quantityType?.[Constants.MONGOOSE_ID] ?? ""
                    : ""
                }
                menu={dropdownData.quantityType}
                error={error.equiptype.quantityType}
                helperText={error.equiptype.quantityType}
                handleChange={(name, value, id) => handleChange({ target: { name, value, id } })}
                marginBottom={2}
              />
            </Grid>
            <Grid item xs={6}>
              <FDropdown
                label="HS Code*"
                id="hsCode"
                name="equiptype"
                defaultValue={
                  modalType === "Update" && openEquipmentType
                    ? editLists?.equiptype?.hsCode?.[Constants.MONGOOSE_ID] ?? ""
                    : ""
                }
                menu={dropdownData.hscode}
                error={Boolean(error.equiptype?.hsCode)}
                helperText={error.equiptype?.hsCode}
                handleChange={(name, value, id) => handleChange({ target: { name, value, id } })}
                marginBottom={2}
              />
            </Grid>
          </Grid>
        </NewProject>
        <NewProject
          title={modalType === "New" ? "New HS Code" : "Edit HS Code"}
          openNewProject={openHSCode}
          handleCloseNewProject={() => handleCloseNewModal("HS Code")}
          handleSave={() => (modalType === "New" ? handleCreate("hscode") : handleUpdate("hscode"))}
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <FTextField
            label="HS Name*"
            placeholder="HS Name"
            id="name"
            name="hscode"
            type="text"
            defaultValue={modalType === "New" ? null : editLists.hscode?.name}
            error={Boolean(error.hscode.name)}
            helperText={error.hscode.name}
            handleChange={handleChange}
            marginBottom={2}
          />

          <FTextField
            label="HS Code*"
            placeholder="HS Code"
            id="code"
            name="hscode"
            type="number"
            defaultValue={modalType === "Update" && openHSCode ? editLists.hscode?.code : null}
            error={Boolean(error.hscode.code)}
            helperText={error.hscode.code}
            handleChange={handleChange}
            marginBottom={2}
          />
        </NewProject>
        <NewProject
          title={modalType === "New" ? "New Certificate Type" : "Edit Certificate Type"}
          openNewProject={openCertificateType}
          handleCloseNewProject={() => handleCloseNewModal("Certificate Type")}
          handleSave={() =>
            modalType === "New" ? handleCreate("certificatetype") : handleUpdate("certificatetype")
          }
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <FTextField
            label="Name*"
            placeholder="Name"
            id="title"
            name="certificatetype"
            type="text"
            error={Boolean(error.certificatetype.title)}
            helperText={error.certificatetype.title}
            defaultValue={modalType === "New" ? null : editLists.certificatetype?.title}
            handleChange={handleChange}
            marginBottom={2}
          />
        </NewProject>
        <NewProject
          title={modalType === "New" ? "New Weight Form" : "Edit Weight Form"}
          openNewProject={openWeightForm}
          handleCloseNewProject={() => handleCloseNewModal("Weight Form")}
          handleSave={() =>
            modalType === "New" ? handleCreate("weightForm") : handleUpdate("weightForm")
          }
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <FTextField
            label="Weight Form*"
            placeholder="Weight Form"
            id="title"
            name="weightForm"
            type="text"
            error={Boolean(error.weightForm.title)}
            helperText={error.weightForm.title}
            defaultValue={modalType === "New" ? null : editLists.weightForm?.title}
            handleChange={handleChange}
            marginBottom={2}
          />
          <FTextField
            label="Weight Abbrevation*"
            placeholder="Weight Abbrevation"
            id="abbreviation"
            name="weightForm"
            type="text"
            error={Boolean(error.weightForm.abbreviation)}
            helperText={error.weightForm.abbreviation}
            defaultValue={modalType === "New" ? null : editLists.weightForm?.abbreviation}
            handleChange={handleChange}
            marginBottom={2}
          />
        </NewProject>
        <NewProject
          title={modalType === "New" ? "New Quantity Type" : "Edit Quantity Type"}
          openNewProject={openQuantityType}
          handleCloseNewProject={() => handleCloseNewModal("Quantity Type")}
          handleSave={() =>
            modalType === "New" ? handleCreate("quantityType") : handleUpdate("quantityType")
          }
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <FTextField
            label="Name*"
            placeholder="Name"
            id="name"
            name="quantityType"
            type="text"
            error={Boolean(error.quantityType.name)}
            helperText={error.quantityType.name}
            defaultValue={modalType === "New" ? null : editLists.quantityType?.name}
            handleChange={handleChange}
            marginBottom={2}
          />
          <FDropdown
            label="Price*"
            id="priceType"
            name="quantityType"
            defaultValue={
              modalType === "Update" && openQuantityType
                ? editLists?.quantityType?.priceType ?? ""
                : ""
            }
            menu={["buy", "rental"]}
            error={error.quantityType.priceType}
            helperText={error.quantityType.priceType}
            handleChange={(name, value, id) => handleChange({ target: { name, value, id } })}
            marginBottom={2}
          />
          <FDropdown
            label="Quantity Type*"
            id="quantityType"
            name="quantityType"
            defaultValue={
              modalType === "Update" && openQuantityType
                ? editLists?.quantityType?.quantityType ?? ""
                : ""
            }
            menu={["unique", "multiple"]}
            error={error.quantityType.quantityType}
            helperText={error.quantityType.quantityType}
            handleChange={(name, value, id) => handleChange({ target: { name, value, id } })}
            marginBottom={2}
          />
        </NewProject>
        <NewProject
          title={modalType === "New" ? "New Currency Unit" : "Edit Currency Unit"}
          openNewProject={openCurrencyUnit}
          handleCloseNewProject={() => handleCloseNewModal("Currency Unit")}
          handleSave={() =>
            modalType === "New" ? handleCreate("currencyUnit") : handleUpdate("currencyUnit")
          }
          actionButton={loading ? ButtonTitles.LOADING : ButtonTitles.SUBMIT}
        >
          <FTextField
            label="Name*"
            placeholder="Name"
            id="name"
            name="currencyUnit"
            type="text"
            error={Boolean(error.currencyUnit.name)}
            helperText={error.currencyUnit.name}
            defaultValue={modalType === "New" ? null : editLists.currencyUnit?.name}
            handleChange={handleChange}
            marginBottom={2}
          />
          <FTextField
            label="Currency Symbol*"
            placeholder="Currency Symbol"
            id="symbol"
            name="currencyUnit"
            type="text"
            error={Boolean(error.currencyUnit.symbol)}
            helperText={error.currencyUnit.symbol}
            defaultValue={modalType === "New" ? null : editLists.currencyUnit?.symbol}
            handleChange={handleChange}
            marginBottom={2}
          />
          <FormGroup error={Boolean(error.currencyUnit.isDefault)}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isDefault"
                  error={Boolean(error.currencyUnit.isDefault)}
                  helperText={error.currencyUnit.isDefault}
                  defaultChecked={modalType === "New" ? null : editLists.currencyUnit?.isDefault}
                  onChange={(e) => handleCheckboxChange("currencyUnit", e, modalType)}
                />
              }
              label="isDefault"
            />
            <FormHelperText sx={{ marginLeft: 0, color: "#FF2E2E" }}>
              {error.currencyUnit.isDefault}
            </FormHelperText>
          </FormGroup>
        </NewProject>
        <ViewProject
          title="Equipment Category"
          openProjectList={openEquipmentGroupData}
          handleCloseProjectList={handleCloseEquipmentGroupData}
        >
          <DataTable
            table={{
              columns: groupColumns,
              rows: groupRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.group}
            currentPage={tablePagination.page}
            handleTablePagination={() => handleTablePagination("groupPage")}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
            licenseRequired
          />
        </ViewProject>
        <ViewProject
          title="Equipment Type"
          openProjectList={openEquipmentTypeData}
          handleCloseProjectList={handleCloseEquipmentTypeData}
        >
          <DataTable
            table={{
              columns: typeColumns,
              rows: typeRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.equiptype}
            currentPage={tablePagination.page}
            handleTablePagination={() => handleTablePagination("typePage")}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
            licenseRequired
          />
        </ViewProject>
        <ViewProject
          title="HS Code"
          openProjectList={openHSCodeData}
          handleCloseProjectList={handleCloseHSCodeData}
        >
          <DataTable
            table={{
              columns: hscodeColumns,
              rows: hscodeRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.hscode}
            currentPage={tablePagination.page}
            handleTablePagination={() => handleTablePagination("hsPage")}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
            licenseRequired
          />
        </ViewProject>
        <ViewProject
          title="Certificate Type"
          openProjectList={openCertificateTypeData}
          handleCloseProjectList={handleCloseCertificateTypeData}
        >
          <DataTable
            table={{
              columns: certificateColumns,
              rows: certificateRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.certificatetype}
            currentPage={tablePagination.page}
            handleTablePagination={() => handleTablePagination("certificatePage")}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
            licenseRequired
          />
        </ViewProject>
        <ViewProject
          title="Weight Form"
          openProjectList={openWeightFormData}
          handleCloseProjectList={handleCloseOpenWeightFormData}
        >
          <DataTable
            table={{
              columns: weightFormColumns,
              rows: weightFormRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.weightForm}
            licenseRequired
          />
        </ViewProject>
        <ViewProject
          title="Quantity Type"
          openProjectList={openQuantityTypeData}
          handleCloseProjectList={handleCloseOpenQuantityTypeData}
        >
          <DataTable
            table={{
              columns: quantityTypeColumns,
              rows: quantityTypeRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.quantityType}
            licenseRequired
          />
        </ViewProject>
        <ViewProject
          title="Currency Unit"
          openProjectList={openCurrencyUnitData}
          handleCloseProjectList={handleCloseCurrencyUnitData}
        >
          <DataTable
            table={{
              columns: currencyUnitColumns,
              rows: currencyUnitRows,
            }}
            backgroundColor={Colors.LIGHT_GRAY}
            textColor={Colors.BLACK}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5 }}
            showTotalEntries={false}
            pagination={{ variant: "gradient", color: "info" }}
            loading={loadingStatus.currencyUnit}
            licenseRequired
          />
        </ViewProject>
        <MDBox py={3}>
          <Grid container spacing={3} sx={{ display: "flex" }}>
            {cardList.map((val) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                sx={{ display: "flex", flex: "1", minWidth: 0 }}
              >
                <MDBox mb={1.5} sx={{ width: "100%" }}>
                  <Card
                    style={{
                      boxShadow: "none",
                      border: "1px solid #E0E6F5",
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <MDBox sx={{ flex: "1 1 auto" }}>
                      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
                        <MDBox textAlign="right" lineHeight={1.25}>
                          <MDTypography variant="h4" fontWeight="bold" color="text">
                            {val.cardTitle}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox mt={2} ml={1} sx={{ flex: "1 1 auto" }}>
                        <MDTypography fontWeight="light" variant="body2" m={1}>
                          {val.content}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox display="flex" justifyContent="flex-end" pt={1} px={2} pb={2}>
                      <CustomButton
                        title="View List"
                        background="#191A51"
                        icon={Icons.VIEW2}
                        color="#ffffff"
                        openModal={() => handleViewModal(val.cardTitle)}
                      />
                      <CustomButton
                        title="Add New"
                        background="#191A51"
                        icon="add_circle_outline"
                        color="#ffffff"
                        openModal={() => handleOpenNewModal(val.cardTitle)}
                      />
                    </MDBox>
                  </Card>
                </MDBox>
              </Grid>
            ))}
          </Grid>
        </MDBox>
        <DeleteModal
          open={deleteData.openDeleteModal}
          title={`Delete ${deleteData.type.toLowerCase()}`}
          message="Are you sure you want to delete?"
          handleClose={handleCloseDeleteModal}
          handleDelete={handleOpenDeleteModal}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default SetupEquipment;
