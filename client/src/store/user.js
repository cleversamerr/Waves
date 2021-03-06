import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "user",
  initialState: {
    data: null,
    auth: false,
  },
  reducers: {
    userAuthenticated: (user, action) => {
      user.auth = true;
      user.data = action.payload.data;
    },

    userLoggedOut: (user, action) => {
      user.data = null;
      user.auth = false;
    },

    userProfileUpdated: (user, action) => {
      const { firstname, lastname } = action.payload.data;
      user.data.firstname = firstname;
      user.data.lastname = lastname;
    },

    userEmailUpdated: (user, action) => {
      user.data.email = action.payload.data.newEmail;
    },

    itemAddedToCart: (user, action) => {
      const item = action.payload.data;
      user.data.cart.push(item);
    },

    cartItemRemoved: (user, action) => {
      const itemId = action.payload.data;
      const index = user.data.cart.findIndex((item) => item === itemId);
      if (index === -1) {
        return;
      }

      user.data.cart.splice(index, 1);
    },
  },
});

const {
  userAuthenticated,
  userLoggedOut,
  userProfileUpdated,
  userEmailUpdated,
  itemAddedToCart,
  cartItemRemoved,
} = slice.actions;

export const authUser = (user) => {
  return userAuthenticated({ data: user });
};

export const logoutUser = () => {
  return userLoggedOut();
};

export const updateUserProfile = (data) => {
  return userProfileUpdated({ data });
};

export const updateUserEmail = (data) => {
  return userEmailUpdated({ data });
};

export const addItemToCart = (item) => {
  return itemAddedToCart({ data: item });
};

export const removeCartItem = (itemId) => {
  return cartItemRemoved({ data: itemId });
};

export const selectUserData = createSelector(
  (state) => state.user,
  (user) => user.data
);

export const selectUserCart = createSelector(
  (state) => state.user,
  (user) => user.data?.cart
);

export const selectUserAuth = createSelector(
  (state) => state.user,
  (user) => user.auth
);

export default slice.reducer;
