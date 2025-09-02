import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2,Save } from "lucide-react";
// import SupplierModal from "./SupplierModal";
// import SupplierDetails from "./SupplierDetails";
import { CustomInputField } from "@/componentss/AdditionalComponent/CustomInputField";
const SingleItemForm = ({ 
  currentItem,
  fields, 
  handleChange, 
  onAddItem,
  handleAddSupplierToItem 
}) => {
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const isFormValid = () => {
    return currentItem.PR_PRODUCT.trim() && currentItem.PR_QTY > 0;
  };

  const handleSupplierSave = (supplierData, applyToAll) => {
    const newSupplier = {
      id: Date.now(),
      ...supplierData,
    };

    console.log(newSupplier)
    
    handleAddSupplierToItem(currentItem.id, newSupplier, applyToAll);
    setIsSupplierModalOpen(false);
  };

  const removeSupplierFromItem = () => {
    handleAddSupplierToItem(currentItem.id, null, false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Add Item</h3>
        <Button 
          onClick={onAddItem} 
          size="sm" 
          className="h-8 px-3"
          // disabled={!isFormValid()}
        >
          <Save className="w-4 h-4 mr-1" />
          Save Item
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Item Details</h4>
              <div className="flex items-center gap-2">
                {currentItem.supplier ? (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => setIsSupplierModalOpen(true)}
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    {currentItem.supplier.name}
                  </Badge>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={() => setIsSupplierModalOpen(true)}
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    Add Supplier
                  </Button>
                )}
              </div>
            </div>

            {/* {currentItem.supplier && (
              <SupplierDetails 
                supplier={currentItem.supplier}
                onRemove={removeSupplierFromItem}
              />
            )} */}
              {console.log(currentItem)}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field,index) => (
                <CustomInputField
                  key={index}
                  field={field.field}
                  label={field.label}
                  // require={header.required !== false}
                  type={field.type || field.inputType || "text"}
                  options={field.options || []}
                  // optionsData={optionsData}
                  value={currentItem[field.field] || ""}
                  onChange={(e) => {
                    const value = e?.target?.value !== undefined ? e.target.value : e;
                    handleChange(field.field, value);
                  }}
                  // error={errors[field.field]}
                  // disabled={isLoading}
                  // key={index}
                  // field={field}
                  // value={currentItem[field.name] || ""}
                  // onChange={(value) => handleChange(currentItem.id, field.name, value)}
                  // id={`current-${field.name}`}
                />
              ))}
            </div>

          
          </div>
        </div>
      </div>

      {/* <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={handleSupplierSave}
      /> */}
    </div>
  );
};

export default SingleItemForm;