import React, { useState, useEffect, useContext } from "react";
import { Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomInputField } from "../AdditionalComponent/CustomInputField";

const EditModal = ({
  isOpen,
  onClose,
  headers,
  onSave,
  isLoading = false,
  initialData = null,
  isEditMode = false,
  master = null,
  setIsEditMode,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        const editFormData = {};
        headers.forEach((header) => {
          if (header.field !== "Sno" && header.field !== "actions") {
            editFormData[header.field] = initialData[header.field] || "";
          }
        });
        setFormData(editFormData);
      } else {
        const newFormData = {};
        headers.forEach((header) => {
          if (header.field !== "Sno" && header.field !== "actions") {
            newFormData[header.field] = "";
          }
        });
        setFormData(newFormData);
      }
      setErrors({});
    }
  }, [isOpen, headers, initialData, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSave = async (formData, master) => {
    try {
      await onSave(formData, master);
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={() => { 
        onClose(); 
        setFormData({}); 
        setIsEditMode(false); 
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Edit {master?.replace(/([a-z])([A-Z])/g, "$1 $2")} Entry
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {headers
              .filter(
                (header) =>
                  header.field !== "Sno" &&
                  header.field !== "actions" &&
                  header.input !== false
              )
              .map((header, index) => (
                <CustomInputField
                  key={index}
                  field={header.field}
                  label={header.label}
                  type={header.type || header.inputType || "text"}
                  options={header.options || []}
                  value={formData[header.field] || ""}
                  onChange={(e) => {
                    const value = e?.target?.value !== undefined ? e.target.value : e;
                    handleInputChange(header.field, value);
                  }}
                  error={errors[header.field]}
                  disabled={isLoading}
                />
              ))}
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setFormData({});
              setIsEditMode(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button onClick={() => handleSave(formData, master)}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Entry
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
