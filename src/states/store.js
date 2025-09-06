import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './features/uiSlice'
import hierarchyReducer from './features/hierarchySlice'
import formReducer from './features/formSlice'
import configReducer from './features/configSlice'
import masterData from './features/masterSlice'
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    hierarchy: hierarchyReducer,
    form: formReducer,
    masterData: masterData,
    config: configReducer,
  },
})


