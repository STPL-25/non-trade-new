import { useSelector } from 'react-redux';
import {   
  useCompanyMasterFields,   
  useDivisionMasterFields,  
  useBranchMasterFields,
  useUomMasterFields,  
  useAcYearFields,  
  useGSTMasterFields,  
  useDeptMasterFields,
  usePrefixFieldsMaster,  
  usePriorityFieldsMaster 
} from "@/Data/Data";

export const useMasterDataFields = () => {
  // Fix the selector - use 'form' instead of 'formData'
  const formData = useSelector(state => state.form) || {};
  
  
  const fields = {
    CompanyMaster: useCompanyMasterFields(formData),
    DivisionMaster: useDivisionMasterFields(formData),
    BranchMaster: useBranchMasterFields(formData),
    UomMaster: useUomMasterFields(formData),
    AcYearMaster: useAcYearFields(formData),
    GSTStateCodeMaster: useGSTMasterFields(formData),
    DeptMaster: useDeptMasterFields(formData),
    PrefixMaster: usePrefixFieldsMaster(formData),
    PriorityMaster: usePriorityFieldsMaster(formData),
  };
  
  return { fields }; 
};
