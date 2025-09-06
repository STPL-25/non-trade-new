import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  formData: null,
  errors: {},
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload
    },
    clearFormErrors: (state) => {
      state.errors = {}
    },
    setFormError: (state, action) => {
      state.errors = { ...state.errors, ...action.payload }
    },
    resetForm: (state) => {
      state.formData = null
      state.errors = {}
    }
  }
})

// Export actions
export const {
  setFormData,
  clearFormErrors,
  setFormError,
  resetForm
} = formSlice.actions

// Export selectors
export const selectFormData = (state) => state.form.formData
export const selectFormErrors = (state) => state.form.errors

export default formSlice.reducer
