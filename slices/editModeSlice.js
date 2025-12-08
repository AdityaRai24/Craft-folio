import { createSlice } from "@reduxjs/toolkit";

export const editModeSlice = createSlice({
  name: "editMode",
  initialState: { currentlyEditing: "", previewMode: false },
  reducers: {
    
    setCurrentEdit: (state, action) => {
      state.currentlyEditing = action.payload;
    },
    setPreviewMode: (state, action) => {
      state.previewMode = action.payload;
      if (action.payload) {
        state.currentlyEditing = "";
      }
    },
  },
});

export const { setCurrentEdit, setPreviewMode } = editModeSlice.actions;

export default editModeSlice.reducer;
