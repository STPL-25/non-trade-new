import React, { useState, useContext, useRef, useEffect } from "react";
import { useCompanyMasterFields,useDivisionMasterFields,useBranchMasterFields ,useUomMasterFields,useAcYearFields,useGSTMasterFields,useDeptMasterFields,
  usePrefixFieldsMaster,usePriorityFieldsMaster} from "@/Data/Data";
import { ParentContext } from "@/ParentContext/ParentContext";
const MasterDataContext = React.createContext();

const MasterDataProvider = ({ children }) => {  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentScreen, setCurrentScreen] = useState("main");
  const [selectedMaster, setSelectedMaster] = useState(null);
  const { formData, setFormData, errors, setErrors } = useContext(ParentContext);

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

  return (
      <MasterDataContext.Provider value={{
          searchTerm,
          setSearchTerm,
          selectedCategory,
          setSelectedCategory,
          viewMode,
          setViewMode,
          currentScreen,
          setCurrentScreen,
          selectedMaster,
          setSelectedMaster,
          fields,formData, setFormData,
      }}>
          {children}
        </MasterDataContext.Provider>
    );

}


export { MasterDataContext, MasterDataProvider };