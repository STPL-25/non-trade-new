import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  config: {
    apiUrl: import.meta.env.VITE_API_URL,
    username: import.meta.env.VITE_USER_NAME,
    password: import.meta.env.VITE_USER_PASSWORD
  }
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload }
    },
    setApiUrl: (state, action) => {
      state.config.apiUrl = action.payload
    },
    setCredentials: (state, action) => {
      const { username, password } = action.payload
      state.config.username = username
      state.config.password = password
    }
  }
})

// Export actions
export const {
  updateConfig,
  setApiUrl,
  setCredentials
} = configSlice.actions

// Export selectors
export const selectConfig = (state) => state.config.config
export const selectApiUrl = (state) => state.config.config.apiUrl
export const selectCredentials = (state) => ({
  username: state.config.config.username,
  password: state.config.config.password
})

export default configSlice.reducer
