import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    items: [],
  },
  reducers: {
    addUser: (state, action) => {
      state.items.push(action.payload);
    },
    removeUser: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearUsers: (state) => {
      state.items = [];
    },
  },
});


export const { addUser, removeUser, clearUsers } = userSlice.actions;

// ✅ Export reducer as default
export default userSlice.reducer;
