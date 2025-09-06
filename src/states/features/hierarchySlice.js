import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk for fetching hierarchy data
export const fetchHierarchyData = createAsyncThunk(
  'hierarchy/fetchHierarchyData',
  async (formData, { getState, rejectWithValue }) => {
    const { config } = getState().config
    const { apiUrl, username, password } = config
    
    if (!apiUrl || !username || !password) {
      return rejectWithValue("Missing environment variables")
    }
    
    try {
      const axiosConfig = {
        auth: {
          username: username,
          password: password
        }
      }
      
      const response = await axios.post(
        `${apiUrl}/api/common_basic_details`, 
        formData, 
        axiosConfig
      )
      
      const basicData = response.data
      return basicData.data // Return the data object containing companies, divisions, branches, departments
      
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || "Failed to fetch hierarchy data")
    }
  }
)

const initialState = {
  companyDetails: [],
  branchDetails: [],
  divDetails: [],
  deptDetails: [],
  loading: false,
  errors: {}
}

const hierarchySlice = createSlice({
  name: 'hierarchy',
  initialState,
  reducers: {
    setCompanyDetails: (state, action) => {
      state.companyDetails = action.payload
    },
    setBranchDetails: (state, action) => {
      state.branchDetails = action.payload
    },
    setDivDetails: (state, action) => {
      state.divDetails = action.payload
    },
    setDeptDetails: (state, action) => {
      state.deptDetails = action.payload
    },
    clearErrors: (state) => {
      state.errors = {}
    },
    setError: (state, action) => {
      state.errors = { ...state.errors, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHierarchyData.pending, (state) => {
        state.loading = true
        state.errors = {}
      })
      .addCase(fetchHierarchyData.fulfilled, (state, action) => {
        state.loading = false
        
        // Destructure the response data
        const { companies, divisions, branches, departments } = action.payload
        
        // Update all state properties with the received data
        state.companyDetails = companies || []
        state.divDetails = divisions || []
        state.branchDetails = branches || []
        state.deptDetails = departments || []
      })
      .addCase(fetchHierarchyData.rejected, (state, action) => {
        state.loading = false
        state.errors.hierarchy = action.payload
      })
  }
})

console.log(hierarchySlice.actions)

export const {
  setCompanyDetails,
  setBranchDetails,  
  setDivDetails,  
  setDeptDetails,
  clearErrors,
  setError
} = hierarchySlice.actions

// Export selectors
export const selectCompanyDetails = (state) => state.hierarchy.companyDetails
export const selectBranchDetails = (state) => state.hierarchy.branchDetails
export const selectDivDetails = (state) => state.hierarchy.divDetails
export const selectDeptDetails = (state) => state.hierarchy.deptDetails
export const selectHierarchyLoading = (state) => state.hierarchy.loading
export const selectHierarchyErrors = (state) => state.hierarchy.errors

export default hierarchySlice.reducer
