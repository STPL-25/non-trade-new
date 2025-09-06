import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './features/uiSlice'
import hierarchyReducer from './features/hierarchySlice'
import formReducer from './features/formSlice'
import configReducer from './features/configSlice'
import masterData from './features/masterSlice'
import  decodeReducer from './features/decodeSlice'
import { de } from 'zod/v4/locales'
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    hierarchy: hierarchyReducer,
    form: formReducer,
    masterData: masterData,
    config: configReducer,
    decode: decodeReducer,
  },
})


