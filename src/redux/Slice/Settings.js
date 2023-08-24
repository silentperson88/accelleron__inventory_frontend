import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import configThunk from "redux/Thunks/Config";
import { CardTitles, defaultData } from "utils/Constants";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WFMOrganizationIcon from "assets/images/icons/WFMWizard/WFMOrganization.png";
import WFMHealthnSafetyIcon from "assets/images/icons/WFMWizard/Health&Safety.png";
import WFMdailyactivityIcon from "assets/images/icons/WFMWizard/Dailyactivity.png";
import WFMActionsIcon from "assets/images/icons/WFMWizard/Actions.png";
import WFMSystemIcon from "assets/images/icons/WFMWizard/System.png";

// Sessions
import Session from "utils/Sessions";

// JWT decode
import jwtDecode from "jwt-decode";

const initialState = {
  loading: "idle",

  cards: [
    {
      index: 0,
      cardTitle: CardTitles.ORGANIZATION,
      logo: WFMOrganizationIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "Logo & Color", icon: <AccessTimeIcon />, link: "", isVisible: true },
        { menuTitle: "Company Details", icon: <AccessTimeIcon />, link: "", isVisible: true },
        {
          menuTitle: "Setup Licenses",
          link: "/client/setting/wizard-licenses",
          isVisible: false,
        },
        { menuTitle: "Roles & Permission", icon: <AccessTimeIcon />, link: "", isVisible: true },
      ],
      isVisible: true,
    },
    {
      index: 1,
      cardTitle: CardTitles.PROJECT_MANAGEMENT,
      logo: WFMdailyactivityIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "Project Setup", link: "/client/setting/wizard-project", isVisible: true },
        { menuTitle: "Report Setup", link: "/client/setting/report-type", isVisible: false },
      ],
      isVisible: true,
    },
    {
      index: 2,
      cardTitle: CardTitles.ACTIONS,
      logo: WFMActionsIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "System Notification ", icon: <AccessTimeIcon />, link: "", isVisible: true },
        { menuTitle: "Send Notification ", icon: <AccessTimeIcon />, link: "", isVisible: true },
      ],
      isVisible: true,
    },
    {
      index: 3,
      cardTitle: CardTitles.SYSTEM_MANAGEMENT,
      logo: WFMSystemIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "User Management", link: "/client/setting/usermanagement", isVisible: false },
        { menuTitle: "Role Management", link: "/client/setting/role-management", isVisible: false },
      ],
      isVisible: false,
    },
    {
      index: 4,
      cardTitle: CardTitles.HEALTH_SAFETY,
      logo: WFMHealthnSafetyIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "Setup Card Categories", link: "/client/setting/category", isVisible: true },
        {
          menuTitle: "Medical Management",
          link: "/client/setting/medicalmanagement",
          isVisible: true,
        },
        { menuTitle: "Configuration", link: "/client/setting/configuration", isVisible: false },
      ],
      isVisible: true,
    },
    {
      index: 5,
      cardTitle: CardTitles.EQUIPMENT,
      logo: WFMActionsIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "Equipment Setup", link: "/client/setting/equipment-setup", isVisible: false },
        { menuTitle: "Add Warehouse", link: "/client/setting/add-warehouse", isVisible: false },
        { menuTitle: "Warehouse", link: "/client/setting/warehouse", isVisible: false },
        { menuTitle: "Orders Requests", link: "/client/setting/order-requests", isVisible: true },
      ],
      isVisible: false,
    },
    {
      index: 6,
      cardTitle: CardTitles.PERSONAL_SETTING,
      logo: WFMActionsIcon,
      logoBgr: "info",
      menu: [
        { menuTitle: "Time format", icon: <AccessTimeIcon />, link: "", isVisible: true },
        { menuTitle: "Language", icon: <AccessTimeIcon />, link: "", isVisible: true },
        { menuTitle: "Dark theme", icon: <AccessTimeIcon />, link: "", isVisible: true },
      ],
      isVisible: true,
    },
  ],
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},

  extraReducers: {
    [configThunk.pending]: (state) => {
      state.loading = "pending";
    },
    [configThunk.fulfilled]: (state, action) => {
      const token = jwtDecode(Session.userToken);
      const { role } = token;

      // Cards and menus related to admin role
      if (
        role === defaultData.ADMIN_ROLE ||
        (role === defaultData.SUPER_ADMIN_ROLE && Session.isSuperAdminViewingAdminPanel)
      ) {
        // provide access of setup license
        state.cards[0].menu[2].isVisible = true;

        state.cards[3].isVisible = true;
        // provide access of user management card
        state.cards[3].menu.forEach((element, index) => {
          state.cards[3].menu[index].isVisible = true;
        });
      }

      action.payload.data.screens.forEach((element) => {
        const currentScreenId = element.screenId;

        if (currentScreenId === defaultData.WAREHOUSE_SCREEN_ID) {
          const warehouseAggrements = element.agreement;

          // provide access of register warehouse on create aggrement
          if (warehouseAggrements?.create || warehouseAggrements?.read) {
            state.cards[5].menu[1].isVisible = true;
            state.cards[5].menu[2].isVisible = true;
            state.cards[5].isVisible = true;
          }
        }
        // Provide Access of Equipment setup only when the user has all equipment agreement like create, update, delete, read
        else if (currentScreenId === defaultData.EQUIPMENT_SCREEN_ID) {
          const equipmentAggrements = element.agreement;

          if (
            equipmentAggrements?.create &&
            equipmentAggrements?.update &&
            equipmentAggrements?.delete &&
            equipmentAggrements?.read
          ) {
            state.cards[5].menu[0].isVisible = true;
            state.cards[5].isVisible = true;
          }
        }
        // Provide Access of configuation menu when user has atleast 1 create aggrement of safe, unsafe, ncr and incident
        else if (
          [
            defaultData.SAFE_CARD_SCREEN_ID,
            defaultData.UNSAFE_CARD_SCREEN_ID,
            defaultData.NCR_CARD_SCREEN_ID,
            defaultData.INCIDENT_CARD_SCREEN_ID,
          ].includes(currentScreenId)
        ) {
          const qhseCardsAggrement = element.agreement;

          if (qhseCardsAggrement?.create) {
            state.cards[4].menu[2].isVisible = true;
            state.cards[4].isVisible = true;
          }
        }
      });
    },
    [configThunk.rejected]: (state) => {
      state.loading = "rejected";
    },

    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.cards = initialState.cards;
    },
  },
});

export default settingSlice.reducer;
