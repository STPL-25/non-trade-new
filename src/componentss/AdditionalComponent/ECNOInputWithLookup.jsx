import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEmployeeData, 
  selectEmployeeData, 
  selectEmployeeLoading, 
  clearEmployeeData,
  selectHierarchyErrors 
} from '../../states/features/hierarchySlice'; // Update path as needed
import { CustomInputField } from "@/componentss/AdditionalComponent/CustomInputField";

const ECNOInputWithLookup = ({ value, onChange, ...props }) => {
  const dispatch = useDispatch();
  const employeeData = useSelector(selectEmployeeData);
  const employeeLoading = useSelector(selectEmployeeLoading);
  const errors = useSelector(selectHierarchyErrors);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleECNOChange = (newValue) => {
    onChange(newValue);
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Clear employee data immediately when ECNO changes
    if (employeeData || errors.employee) {
      dispatch(clearEmployeeData());
    }

    // Set new timer for API call
    if (newValue && newValue.trim().length >= 3) { // Only search if ECNO has at least 3 characters
      const timer = setTimeout(() => {
        dispatch(fetchEmployeeData({ ecno: newValue.trim() }));
      }, 500); // 500ms debounce
      
      setDebounceTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(clearEmployeeData());
    };
  }, [dispatch]);

  return (
    <div className="space-y-2">
      <CustomInputField
        {...props}
        value={value}
        onChange={handleECNOChange}
      />
      
      {/* Loading state */}
      {employeeLoading && value && value.length >= 3 && (
        <div className="text-sm text-blue-600 flex items-center bg-blue-50 border border-blue-200 rounded-md p-2">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Searching for employee...
        </div>
      )}
      
      {/* Employee found */}
      {employeeData && employeeData.ename && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="text-sm text-green-800">
            <strong>Employee Found:</strong> {employeeData.ename}
          </div>    
        </div>
      )}
      
      {/* Employee not found */}
      {value && value.length >= 3 && !employeeLoading && !employeeData && errors.employee && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          <strong>Employee not found:</strong> No employee found with ECNO "{value}"
        </div>
      )}
      
      {/* General error */}
      {value && value.length >= 3 && !employeeLoading && errors.employee && !errors.employee.includes('not found') && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          <strong>Error:</strong> {errors.employee}
        </div>
      )}
    </div>
  );
};

export default ECNOInputWithLookup;
