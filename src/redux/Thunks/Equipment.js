import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const ProductListThunk = createAsyncThunk("productlist/api", async (param) => {
  const res = await ApiService.get(`equipments?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const equipmentGetByIdThunk = createAsyncThunk("equipment/api", async (param) => {
  const res = await ApiService.get(`equipments/${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const EquipmentCategoryThunk = createAsyncThunk("equipmentcategory/api", async (param) => {
  const res = await ApiService.get(`equipment-categories?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const EquipmentTypeThunk = createAsyncThunk("equipmenttype/api", async (param) => {
  const res = await ApiService.get(`equipment-types?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const EquipmentHSCodeThunk = createAsyncThunk("equipmenthscode/api", async (param) => {
  const res = await ApiService.get(`hs-codes?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const CreateNewProduct = createAsyncThunk("product/create", async (body) => {
  const res = await ApiService.post(
    `equipments`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const equipmentUpdateThunk = createAsyncThunk("equipment-update/api", async (data) => {
  const res = await ApiService.patch(
    `equipments/${data.id}`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});
export const equipmentDeleteThunk = createAsyncThunk(
  "equipment-delete/api",
  async (equipmentId) => {
    const res = await ApiService.delete(`equipments/${equipmentId}/`, {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    });
    return res;
  }
);

export const groupCreateThunk = createAsyncThunk("group-create/api", async (body) => {
  const res = await ApiService.post(
    `equipment-categories`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const groupUpdateThunk = createAsyncThunk("group-update/api", async (data) => {
  const res = await ApiService.patch(
    `equipment-categories/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const groupDeleteThunk = createAsyncThunk("group-delete/api", async (id) => {
  const res = await ApiService.delete(`equipment-categories/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

export const hscodeCreateThunk = createAsyncThunk("group-create/api", async (body) => {
  const res = await ApiService.post(
    `hs-codes`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const hscodeUpdateThunk = createAsyncThunk("hscode-update/api", async (data) => {
  const res = await ApiService.patch(
    `hs-codes/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const hscodeDeleteThunk = createAsyncThunk("hscode-delete/api", async (id) => {
  const res = await ApiService.delete(`hs-codes/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

export const typeCreateThunk = createAsyncThunk("type-create/api", async (body) => {
  const res = await ApiService.post(
    `equipment-types`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const typeUpdateThunk = createAsyncThunk("type-update/api", async (data) => {
  const res = await ApiService.patch(
    `equipment-types/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const typeDeleteThunk = createAsyncThunk("type-delete/api", async (id) => {
  const res = await ApiService.delete(`equipment-types/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

export const certificateListTypeThunk = createAsyncThunk(
  "certificateType-list/api",
  async (param) => {
    const res = await ApiService.get(`equipment-certificate-types?${param}`, {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    })
      .then((r) => r)
      .catch((error) => error.response);
    const params = new URLSearchParams(param);
    const page = params.get("page");
    return page === "0"
      ? { data: res.data, type: "add", status: res.status }
      : { data: res.data, type: "append", status: res.status };
  }
);
export const certificateTypeCreateThunk = createAsyncThunk(
  "certificateType-create/api",
  async (body) => {
    const res = await ApiService.post(
      `equipment-certificate-types`,
      { ...body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((err) => err.response);
    return res;
  }
);

export const certificateTypeUpdateThunk = createAsyncThunk(
  "certificateType-update/api",
  async (data) => {
    const res = await ApiService.patch(
      `equipment-certificate-types/${data.id}/`,
      { ...data.body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((err) => err.response);
    return res;
  }
);

export const certificateTypeDeleteThunk = createAsyncThunk(
  "certificateType-delete/api",
  async (id) => {
    const res = await ApiService.delete(`equipment-certificate-types/${id}/`, {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    });
    return res;
  }
);

export const createEquipmentDocumentThunk = createAsyncThunk(
  "equipmentDocumnent/create",
  async (body) => {
    const res = await ApiService.post(
      `equipment-image-cetrificates`,
      { ...body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((err) => err.response);
    return res;
  }
);

export const equipmentByIdThunk = createAsyncThunk("equipment-by-id/api", async (id) => {
  const res = await ApiService.get(`equipments/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const createWarehouseThunk = createAsyncThunk("warehouse/create", async (body) => {
  const res = await ApiService.post(
    `equipment-warehouse`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

// Weight Form
export const weightformListThunk = createAsyncThunk("weightform-list/api", async (param) => {
  const res = await ApiService.get(`equipment-units?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});
export const weightformCreateThunk = createAsyncThunk(
  "equipment-units-create/api",
  async (body) => {
    const res = await ApiService.post(
      `equipment-units`,
      { ...body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    );
    return res;
  }
);

export const weightformUpdateThunk = createAsyncThunk(
  "equipment-units-update/api",
  async (data) => {
    const res = await ApiService.patch(
      `equipment-units/${data.id}/`,
      { ...data.body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((err) => err.response);
    return res;
  }
);

export const weightformDeleteThunk = createAsyncThunk("equipment-units-delete/api", async (id) => {
  const res = await ApiService.delete(`equipment-units/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

// Quantity Type
export const quantitytypeListThunk = createAsyncThunk("quantitytype-list/api", async (param) => {
  const res = await ApiService.get(`equipment-quantity-types?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});
export const quantitytypeCreateThunk = createAsyncThunk(
  "equipment-quantity-types/api",
  async (body) => {
    const res = await ApiService.post(
      `equipment-quantity-types`,
      { ...body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((err) => err.response);
    return res;
  }
);

export const quantitytypeUpdateThunk = createAsyncThunk("quantitytype-update/api", async (data) => {
  const res = await ApiService.patch(
    `equipment-quantity-types/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const quantitytypeDeleteThunk = createAsyncThunk("quantitytype-delete/api", async (id) => {
  const res = await ApiService.delete(`equipment-quantity-types/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

// Currency Unit
export const currencyunitListThunk = createAsyncThunk("currencyunit-list/api", async (param) => {
  const res = await ApiService.get(`currency-units?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});
export const currencyunitCreateThunk = createAsyncThunk("currencyunit/api", async (body) => {
  const res = await ApiService.post(
    `currency-units`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const currencyunitUpdateThunk = createAsyncThunk("currencyunit-update/api", async (data) => {
  const res = await ApiService.patch(
    `currency-units/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const currencyunitDeleteThunk = createAsyncThunk("currencyunit-delete/api", async (id) => {
  const res = await ApiService.delete(`currency-units/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

export default ProductListThunk;
