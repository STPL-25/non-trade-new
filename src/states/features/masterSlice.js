import { createSlice } from '@reduxjs/toolkit';

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState: {
    searchTerm: '',
    selectedCategory: 'all',
    viewMode: 'grid',
    currentScreen: 'main',
    selectedMaster: null,
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    setCurrentScreen(state, action) {
      state.currentScreen = action.payload;
    },
    setSelectedMaster(state, action) {
      state.selectedMaster = action.payload;
    },
   
  }
});

export const {   setSearchTerm, setSelectedCategory, setViewMode, setCurrentScreen, setSelectedMaster } = masterDataSlice.actions;
export const selectMasterData = (state) => state.masterData;
export const selectSearchTerm = (state) => state.masterData.searchTerm;
export const selectSelectedCategory = (state) => state.masterData.selectedCategory;
export const selectViewMode = (state) => state.masterData.viewMode;
export const selectCurrentScreen = (state) => state.masterData.currentScreen;
export const selectSelectedMaster = (state) => state.masterData.selectedMaster;

export default masterDataSlice.reducer;
