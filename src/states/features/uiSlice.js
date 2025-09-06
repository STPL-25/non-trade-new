import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  expandedItems: {},
  activeItem: "masters",
  activeComponent: "",
  sidebarWidth: 280,
  isCollapsed: false,
  headerComponentRender: "",
  isFullscreen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setExpandedItems: (state, action) => {
      state.expandedItems = action.payload
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload
    },
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload
    },
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload
    },
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed
      state.sidebarWidth = state.isCollapsed ? 80 : 280
    },
    setHeaderComponentRender: (state, action) => {
      state.headerComponentRender = action.payload
    },
    setIsFullscreen: (state, action) => {
      state.isFullscreen = action.payload
    },
  }
})

// Export actions
export const {
  setSidebarOpen,
  setExpandedItems,
  setActiveItem,
  setActiveComponent,
  setSidebarWidth,
  toggleCollapse,
  setHeaderComponentRender,
  setIsFullscreen,
} = uiSlice.actions

// Export selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectExpandedItems = (state) => state.ui.expandedItems
export const selectActiveItem = (state) => state.ui.activeItem
export const selectActiveComponent = (state) => state.ui.activeComponent
export const selectSidebarWidth = (state) => state.ui.sidebarWidth
export const selectIsCollapsed = (state) => state.ui.isCollapsed
export const selectHeaderComponentRender = (state) => state.ui.headerComponentRender
export const selectIsFullscreen = (state) => state.ui.isFullscreen

export default uiSlice.reducer
