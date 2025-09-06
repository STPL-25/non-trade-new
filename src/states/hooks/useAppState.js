import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

// UI imports
import { setSidebarOpen, setExpandedItems, setActiveItem, setActiveComponent,
  setSidebarWidth, toggleCollapse, setHeaderComponentRender, setIsFullscreen,
  selectSidebarOpen,selectExpandedItems,selectActiveItem, selectActiveComponent,
  selectSidebarWidth,  selectIsCollapsed,  selectHeaderComponentRender,  selectIsFullscreen} from '../features/uiSlice'

// Hierarchy imports
import { fetchHierarchyData, setCompanyDetails, setBranchDetails, setDivDetails, setDeptDetails, clearErrors,
  setError, selectCompanyDetails, selectBranchDetails, selectDivDetails, selectDeptDetails,selectHierarchyLoading,
  selectHierarchyErrors } from '../features/hierarchySlice'

// Form imports
import {  setFormData, clearFormErrors,setFormError,resetForm,selectFormData, selectFormErrors} from '../features/formSlice'

// Config imports
import {selectConfig} from '../features/configSlice' 

import { setSearchTerm, setSelectedCategory, setViewMode, setCurrentScreen, setSelectedMaster,
         selectMasterData,selectSearchTerm,selectCurrentScreen,selectSelectedCategory,selectViewMode,
         selectSelectedMaster} from '../features/masterSlice'
import { decryptData, clearDecryptedData, clearError ,selectDecryptedData,selectIsLoading,selectError,selectUserData,setUserData} from '../features/decodeSlice'



         
export const useAppState = () => {
  const dispatch = useDispatch()
  

  // Selectors
  const ui = {
    sidebarOpen: useSelector(selectSidebarOpen),
    expandedItems: useSelector(selectExpandedItems),
    activeItem: useSelector(selectActiveItem),
    activeComponent: useSelector(selectActiveComponent),
    sidebarWidth: useSelector(selectSidebarWidth),
    isCollapsed: useSelector(selectIsCollapsed),
    headerComponentRender: useSelector(selectHeaderComponentRender),
    isFullscreen: useSelector(selectIsFullscreen)
  }
  
  const hierarchy = {
    companyDetails: useSelector(selectCompanyDetails),
    branchDetails: useSelector(selectBranchDetails),
    divDetails: useSelector(selectDivDetails),
    deptDetails: useSelector(selectDeptDetails),
    loading: useSelector(selectHierarchyLoading),
    errors: useSelector(selectHierarchyErrors)
  }
  
  const form = {
    formData: useSelector(selectFormData),
    errors: useSelector(selectFormErrors)
  }
  const master = {
    searchTerm: useSelector(selectSearchTerm),
    selectedCategory: useSelector(selectSelectedCategory),
    viewMode: useSelector(selectViewMode),
    currentScreen: useSelector(selectCurrentScreen),
    selectedMaster: useSelector(selectSelectedMaster)
  }

  const config = useSelector(selectConfig)
  const decode = {
    decryptedData: useSelector(selectDecryptedData),
    isLoading: useSelector(selectIsLoading),
    error: useSelector(selectError),
    userData: useSelector(selectUserData)
  }
  
  useEffect(() => {
    if (form.formData !== null) {
      dispatch(fetchHierarchyData(form.formData))
    }
  }, [dispatch, form.formData])
  
  return {
    ...ui,
    ...hierarchy,
    ...form,
    ...master,
    ...decode,
    config,
    
    // UI Actions
    setSidebarOpen: (value) => dispatch(setSidebarOpen(value)),
    setExpandedItems: (items) => dispatch(setExpandedItems(items)),
    setActiveItem: (item) => dispatch(setActiveItem(item)),
    setActiveComponent: (component) => dispatch(setActiveComponent(component)),
    setSidebarWidth: (width) => dispatch(setSidebarWidth(width)),
    toggleCollapse: () => dispatch(toggleCollapse()),
    setHeaderComponentRender: (component) => dispatch(setHeaderComponentRender(component)),
    setIsFullscreen: (fullscreen) => dispatch(setIsFullscreen(fullscreen)),
    
    // Hierarchy Actions
    setCompanyDetails: (details) => dispatch(setCompanyDetails(details)),
    setBranchDetails: (details) => dispatch(setBranchDetails(details)),
    setDivDetails: (details) => dispatch(setDivDetails(details)),
    setDeptDetails: (details) => dispatch(setDeptDetails(details)),
    clearErrors: () => dispatch(clearErrors()),
    setError: (error) => dispatch(setError(error)),
    
    // Form Actions
    setFormData: (data) => dispatch(setFormData(data)),
    clearFormErrors: () => dispatch(clearFormErrors()),
    setFormError: (error) => dispatch(setFormError(error)),
    resetForm: () => dispatch(resetForm()),
    //master data Actions
    setSearchTerm: (term) => dispatch(setSearchTerm(term)),
    setSelectedCategory: (category) => dispatch(setSelectedCategory(category)),
    setViewMode: (mode) => dispatch(setViewMode(mode)),
    setCurrentScreen: (screen) => dispatch(setCurrentScreen(screen)),
    setSelectedMaster: (master) => dispatch(setSelectedMaster(master)),

    // Async Actions
    fetchHierarchyData: (data) => dispatch(fetchHierarchyData(data)),

    // Decode Actions
    decryptData: (payload) => dispatch(decryptData(payload)),
    clearDecryptedData: () => dispatch(clearDecryptedData()),
    clearDecodeError: () => dispatch(clearError()),
    setUserData: (data) => dispatch(setUserData(data))

  }
}
