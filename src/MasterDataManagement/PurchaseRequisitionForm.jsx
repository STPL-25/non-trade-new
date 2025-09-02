import React, { useState } from "react";
import FormHeader from "../SubComponent/PR/FormHeader";
import FormFooter from "../SubComponent/PR/FormFooter";
import SingleItemForm from "../SubComponent/PR/SingleItemForm";
import AddedItemsList from "../SubComponent/PR/AddedItemsList";
import PrSummary from "@/SubComponent/PR/PrSummary";
import usePost from "@/hooks/usePostHook";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomInputField } from "@/componentss/AdditionalComponent/CustomInputField";

import {
  useBasicInfoFields,
  itemFields,
  supplierFields,
  tabs,
  priorities,
} from "../Data/PRData";

export default function PurchaseRequisitionForm() {
  const isMobile = useIsMobile();
  const url = import.meta.env.VITE_API_URL;
  const { data, loading, error, postData, reset } = usePost();

  // Basic Info
  const basicInfoFields = useBasicInfoFields();
  const [formData, setFormData] = useState({});

  // Items & Suppliers
  const emptyItem = {
    id: 1,
    PR_PRODUCT: "",
    PR_QTY: 1,
    SPECS: "",
    UOM_SNO: "",
    supplier: null,
  };
  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // UI State
  const [showSummary, setShowSummary] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCurrentItemChange = (field, value) => {
    setCurrentItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSupplierToCurrentItem = (supplier, applyToAll) => {
    setCurrentItem((prev) => ({ ...prev, supplier }));
    if (applyToAll) {
      setItems((prev) =>
        prev.map((item) => ({ ...item, supplier }))
      );
    }
  };

  const canAddItem =
    currentItem.PR_PRODUCT.trim() !== "" && currentItem.PR_QTY > 0;

  const handleAddItem = () => {
    if (!canAddItem) return;
    setItems((prev) => [...prev, currentItem]);
    setCurrentItem((prev) => ({
      ...emptyItem,
      id: prev.id + 1,
    }));
  };

  const handleEditItem = (item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setCurrentItem(item);
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft && items.length === 0) {
      toast.error("Add at least one item before submitting.");
      return;
    }
    const status = isDraft ? "draft" : "submitted";
    try {
      postData(`${url}/api/pr`, { formData, items, status });
      toast.success("PR Saved Successfully");
      if (!isDraft) {
        // Reset all state
        setFormData({});
        setItems([]);
        setSuppliers([]);
        setCurrentItem({ ...emptyItem, id: 1 });
        setShowSummary(false);
        setActiveTab("basic");
      }
    } catch (err) {
      toast.error("Error Occurred");
    }
  };

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : "mx-auto max-w-full"
      }`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <FormHeader
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          showSummary={showSummary}
          setShowSummary={setShowSummary}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      <div className="flex-1">
        {/* Desktop Layout */}
        <div
          className={`hidden md:grid gap-4 p-4 h-[calc(100vh-140px)] ${
            showSummary
              ? "md:grid-cols-3 lg:grid-cols-12"
              : "md:grid-cols-1"
          }`}
        >
          {/* Form Section */}
          <div
            className={`flex flex-col overflow-hidden ${
              showSummary ? "lg:col-span-8" : "col-span-1"
            }`}
          >
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Basic Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {basicInfoFields.map((fieldDef,index) => (
                  <CustomInputField
                    key={index}
                    field={fieldDef.field}
                    label={fieldDef.label}
                    require={fieldDef.require !== false}
                    type={fieldDef.type || fieldDef.inputType || "text"}
                    options={fieldDef.options || []}
                    value={formData[fieldDef.field] || ""}
                    onChange={(e) => {
                      const val =
                        e?.target?.value !== undefined
                          ? e.target.value
                          : e;
                      handleInputChange(fieldDef.field, val);
                    }}
                  />
                ))}
              </div>

              {/* Item Entry & List */}
              {console.log(itemFields)}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <SingleItemForm
                  currentItem={currentItem}
                  fields={itemFields}
                  handleChange={handleCurrentItemChange}
                  onAddItem={handleAddItem}
                  suppliers={suppliers}
                  handleAddSupplierToItem={handleAddSupplierToCurrentItem}
                  addButtonDisabled={!canAddItem}
                />
                <AddedItemsList
                  items={items}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              </div>
            </div>
          </div>

          {/* Desktop Summary */}
          {showSummary && (
            <div className="lg:col-span-4 h-full overflow-y-auto">
              <PrSummary
                formData={formData}
                items={items}
                suppliers={suppliers}
                priorities={priorities}
              />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden h-[calc(100vh-140px)] overflow-y-auto p-4 space-y-4">
          {activeTab === "basic" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <div className="grid grid-cols-1 gap-4">
                {basicInfoFields.map((fieldDef) => (
                  <CustomInputField
                    key={fieldDef.field}
                    field={fieldDef.field}
                    label={fieldDef.label}
                    require={fieldDef.require !== false}
                    type={fieldDef.type || fieldDef.inputType || "text"}
                    options={fieldDef.options || []}
                    value={formData[fieldDef.field] || ""}
                    onChange={(e) => {
                      const val =
                        e?.target?.value !== undefined
                          ? e.target.value
                          : e;
                      handleInputChange(fieldDef.field, val);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <>
              <SingleItemForm
                currentItem={currentItem}
                fields={itemFields}
                handleChange={handleCurrentItemChange}
                onAddItem={handleAddItem}
                suppliers={suppliers}
                handleAddSupplierToItem={handleAddSupplierToCurrentItem}
                addButtonDisabled={!canAddItem}
              />
              <AddedItemsList
                items={items}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <FormFooter
        items={items}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
