// import React, { useState, useContext, useRef, useEffect } from "react";
// import axios from "axios";
// const ParentContext = React.createContext();

// const ParentProvider = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [expandedItems, setExpandedItems] = useState({});
//   const [activeItem, setActiveItem] = useState("masters");
//   const [activeComponent, setActiveComponent] = useState("");
//   const [sidebarWidth, setSidebarWidth] = useState(280);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [companyDetails,setCompanyDetails]=useState([]);
//   const [branchDetails,setBranchDetails]= useState([])
//   const [divDetails,setDivDetails]=useState([])
//   const [headerComponentRender,setHeaderComponentRender]=useState("")
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const [errors, setErrors] = useState({});
//   const apiUrl = import.meta.env.VITE_API_URL;
// const username = import.meta.env.VITE_USER_NAME;
// const password = import.meta.env.VITE_USER_PASSWORD;
//    let config = {};
//      config.auth = {
//             username: username,
//             password: password
//           };

// const groupData= async () => {
//     try {
//     const deptData = await axios.post(`${apiUrl}/api/common_master/hierarchy-data`,formData,config);
//     const Data= deptData?.data?.data || []
//     console.log(Data)
//     // setBranchDetails(cmpData);
//   } catch (error) {
//     console.error("Error fetching CompanyMaster data:", error);
//     // setBranchDetails( []);
//   }
// }
// useEffect(() => {
//   groupData();
//   console.log("formdata", formData);
// }, [formData]);
  
// const toggleCollapse = () => {
//   setIsCollapsed(!isCollapsed);
    
//   if (!isCollapsed) {
//       setSidebarWidth(80);
//     } else {
//       setSidebarWidth(280);
//     }
//   };
//   return (
//     <ParentContext.Provider
//   value={{
//   sidebarOpen, setSidebarOpen,  expandedItems, setExpandedItems,  activeItem, setActiveItem,  activeComponent, setActiveComponent,
//   sidebarWidth, setSidebarWidth,  isCollapsed, setIsCollapsed,  toggleCollapse,  companyDetails, divDetails, branchDetails,
//   headerComponentRender, setHeaderComponentRender,  isFullscreen, setIsFullscreen, formData, setFormData, errors, setErrors
// }}>
//    {children}
//   </ParentContext.Provider>
  
//   );
// };

// export { ParentContext, ParentProvider };


import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
const ParentContext = React.createContext();

const ParentProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeItem, setActiveItem] = useState("masters");
  const [activeComponent, setActiveComponent] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);
  const [divDetails, setDivDetails] = useState([]);
  const [deptDetails, setDeptDetails] = useState([]); 
  const [headerComponentRender, setHeaderComponentRender] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;
  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASSWORD;
  
  let config = {};
  config.auth = {
    username: username,
    password: password
  };

const groupData = async () => {
  try {
    const deptData = await axios.post(`${apiUrl}/api/common_master/hierarchy-data`, formData, config);
    const Data = deptData?.data?.data || [];
    console.log("API Response Data:", Data);
    
    if (!formData || Object.keys(formData).length === 0) {
      setCompanyDetails(Data);
      setDivDetails([]);
      setBranchDetails([]);
      setDeptDetails([]);
      console.log("Setting company details");
    } else if (formData.com_sno && !formData.div_sno) {
      setDivDetails(Data);
      setBranchDetails([]);
      setDeptDetails([]);
      console.log("Setting division details");
    } else if (formData.com_sno && formData.div_sno && !formData.brn_no) {
      setBranchDetails(Data);
      setDeptDetails([]);
      console.log("Setting branch details");
    } else if (formData.com_sno && formData.div_sno && formData.brn_no) {
      setDeptDetails(Data);
      console.log("Setting department details");
    }
    
  } catch (error) {
    console.error("Error fetching hierarchy data:", error);
    setCompanyDetails([]);
    setDivDetails([]);
    setBranchDetails([]);
    setDeptDetails([]);
  }
};


  useEffect(() => {
    groupData();
    console.log("formdata", formData);
  }, [formData?.com_sno, formData?.div_sno, formData?.brn_no]); 

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    
    if (!isCollapsed) {
      setSidebarWidth(80);
    } else {
      setSidebarWidth(280);
    }
  };

  return (
    <ParentContext.Provider
      value={{
        sidebarOpen, setSidebarOpen,
        expandedItems, setExpandedItems,
        activeItem, setActiveItem,
        activeComponent, setActiveComponent,
        sidebarWidth, setSidebarWidth,
        isCollapsed, setIsCollapsed,
        toggleCollapse,
        companyDetails, setCompanyDetails,
        divDetails, setDivDetails,
        branchDetails, setBranchDetails,
        deptDetails, setDeptDetails, // Add department details to context
        headerComponentRender, setHeaderComponentRender,
        isFullscreen, setIsFullscreen,
        formData, setFormData,
        errors, setErrors
      }}
    >
      {children}
    </ParentContext.Provider>
  );
};

export { ParentContext, ParentProvider };

