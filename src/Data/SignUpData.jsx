import {  useMemo } from "react";
import { useAppState } from "@/states/hooks/useAppState";
const useSignUpFields = () => {
  const { companyDetails, divDetails, branchDetails ,deptDetails,setDeptDetails,formData} = useAppState();
  console.log(companyDetails, divDetails, branchDetails, formData);
  
  return useMemo(
    () => [
      { field: "ECNO", label: "Ecno", type: "text", placeholder: "Enter ECNO", require: true },
      { field: "com_sno", label: "Company", type: "select", require: true, options: companyDetails || [], placeholder: "Select Company" },
      { field: "div_sno", label: "Division", type: "select", require: true, options: divDetails || [], placeholder: "Select Division" },
      { field: "brn_sno", label: "Branch", type: "select", require: true, options: branchDetails || [], placeholder: "Select Branch" },
      { field: "dept_sno", label: "Department", type: "select", require: true, options: deptDetails || [], placeholder: "Select Department" },
      { field: "sign_up_cug", label: "Cug Mobile Number", type: "number", placeholder: "Enter CUG Mobile Number", require: true, maxLength: 10 },
      { field: "sign_up_otp", label: "Otp", type: "number", placeholder: "Enter OTP", require: true, maxLength: 6, show: false },
      { field: "sign_up_pass", label: "Password", type: "password", placeholder: "Enter Password", require: true, maxLength: 6, show: false },
      { field: "con_sign_up_pass", label: "Confirm Password", type: "password", placeholder: "Enter Confirm Password", require: true, maxLength: 6, show: false },

    ],
    [companyDetails, divDetails, branchDetails,formData?.com_sno,formData?.div_sno,formData?.brn_no]
  );
};

const useLoginFields = () => {
  return [
    { field: "ECNO", label: "ECNO", type: "text", placeholder: "Enter ECNO", require: true },
    { field: "PASSWORD", label: "PASSWORD", type: "password", placeholder: "Enter Password", require: true, showToggle: true }
  ];
};

export { useSignUpFields, useLoginFields };
