import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "redux/ApiService/ApiService";

// Craete Fiedls APIs

const projectCreateThunk = createAsyncThunk("project-create/api", async (body) => {
  const res = await ApiService.post(
    `projects`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const locationCreateThunk = createAsyncThunk("location-create/api", async (body) => {
  const res = await ApiService.post(
    `locations`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const projectStringCreateThunk = createAsyncThunk(
  "project-string-create/api",
  async (body) => {
    const res = await ApiService.post(
      `project-strings`,
      { ...body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    );
    return res.data;
  }
);

export const assetCreateThunk = createAsyncThunk("asset-create/api", async (body) => {
  const res = await ApiService.post(
    `assets`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const scopesCreateThunk = createAsyncThunk("scope-create/api", async (body) => {
  const res = await ApiService.post(
    `scopes`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const activityCreateThunk = createAsyncThunk("activity-create/api", async (body) => {
  const res = await ApiService.post(
    `activities`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const teamCreateThunk = createAsyncThunk("team-create/api", async (body) => {
  const res = await ApiService.post(
    `teams`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const memberCreateThunk = createAsyncThunk("member-create/api", async (body) => {
  const res = await ApiService.post(
    `members/single-member`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const functionCreateThunk = createAsyncThunk("function-create/api", async (body) => {
  const res = await ApiService.post(
    `functions`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

// List Fields APIs

export const projectListThunk = createAsyncThunk("project-list/api", async () => {
  const res = await ApiService.get(`projects`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

// pending
export const locationListThunk = createAsyncThunk("location-list/api", async () => {
  const res = await ApiService.get(`location/list`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const locationListByIdThunk = createAsyncThunk("location-list/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/locations`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const severityListThunk = createAsyncThunk("severity-list/api", async () => {
  const res = await ApiService.get(`severities`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const likelihoodListThunk = createAsyncThunk("likelihood-list/api", async () => {
  const res = await ApiService.get(`likelihoods`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const projectStringListThunk = createAsyncThunk("projectString-list/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/project-strings`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const assetListThunk = createAsyncThunk("asset-list/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/assets`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const scopesThunk = createAsyncThunk("scopes/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/scopes`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const activityThunk = createAsyncThunk("activity/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/activities`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const memberThunk = createAsyncThunk("member-list/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/members`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const teamThunk = createAsyncThunk("team-list/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/teams`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const functionListThunk = createAsyncThunk("function-list/api", async (id) => {
  const res = await ApiService.get(`projects/${id}/functions`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

// Update API
export const projectsUpdateThunk = createAsyncThunk("projects-update/api", async (data) => {
  const res = await ApiService.patch(
    `projects/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const locationsUpdateThunk = createAsyncThunk("locations-update/api", async (data) => {
  const res = await ApiService.patch(
    `locations/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const projectStringsUpdateThunk = createAsyncThunk(
  "project-strings-update/api",
  async (data) => {
    const res = await ApiService.patch(
      `project-strings/${data.id}/`,
      { ...data.body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    );
    return res.data;
  }
);
export const assetsUpdateThunk = createAsyncThunk("assets-update/api", async (data) => {
  const res = await ApiService.patch(
    `assets/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const scopesUpdateThunk = createAsyncThunk("scopes-update/api", async (data) => {
  const res = await ApiService.patch(
    `scopes/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const activitiesUpdateThunk = createAsyncThunk("activities-update/api", async (data) => {
  const res = await ApiService.patch(
    `activities/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const membersUpdateThunk = createAsyncThunk("members-update/api", async (data) => {
  const res = await ApiService.patch(
    `members/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const teamUpdateThunk = createAsyncThunk("team-update/api", async (data) => {
  const res = await ApiService.patch(
    `teams/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});
export const functionUpdateThunk = createAsyncThunk("function-update/api", async (data) => {
  const res = await ApiService.patch(
    `functions/${data.id}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

// Delete API
export const projectsDeleteThunk = createAsyncThunk("projects-delete/api", async (id) => {
  const res = await ApiService.delete(`projects/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const locationsDeleteThunk = createAsyncThunk("locations-delete/api", async (id) => {
  const res = await ApiService.delete(`locations/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const projectStringsDeleteThunk = createAsyncThunk(
  "project-strings-delete/api",
  async (id) => {
    const res = await ApiService.delete(`project-strings/${id}/`, {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    });
    return res.data;
  }
);
export const assetsDeleteThunk = createAsyncThunk("assets-delete/api", async (id) => {
  const res = await ApiService.delete(`assets/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const scopesDeleteThunk = createAsyncThunk("scopes-delete/api", async (id) => {
  const res = await ApiService.delete(`scopes/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const activitiesDeleteThunk = createAsyncThunk("activities-delete/api", async (id) => {
  const res = await ApiService.delete(`activities/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const membersDeleteThunk = createAsyncThunk("members-delete/api", async (id) => {
  const res = await ApiService.delete(`members/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const teamsDeleteThunk = createAsyncThunk("teams-delete/api", async (id) => {
  const res = await ApiService.delete(`teams/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const functionDeleteThunk = createAsyncThunk("function-delete/api", async (id) => {
  const res = await ApiService.delete(`functions/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const reportTypesList = createAsyncThunk("report-types-data/list", async (param) => {
  const res = await ApiService.get(`report-types?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });

  return res.data;
});

export default projectCreateThunk;
