import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Send, 
  FileText, 
  Package, 
  User, 
  Calendar,
  DollarSign,
  Eye,
  Menu,
  X,
  Building2,
  ClipboardList
} from "lucide-react";

export default function PurchaseRequisitionForm() {
  // Mock data for demonstration
  const [formData, setFormData] = useState({
    department: "",
    requestedBy: "",
    requestDate: "",
    priority: "",
    purpose: "",
    budgetCode: ""
  });

  const [currentItem, setCurrentItem] = useState({
    id: 1,
    product: "",
    quantity: 1,
    specifications: "",
    unitOfMeasure: "",
    estimatedCost: "",
    supplier: null
  });

  const [items, setItems] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Form fields configuration
  const basicInfoFields = [
    { field: "department", label: "Department", type: "select", options: ["IT", "HR", "Finance", "Operations"], icon: Building2 },
    { field: "requestedBy", label: "Requested By", type: "text", icon: User },
    { field: "requestDate", label: "Request Date", type: "date", icon: Calendar },
    { field: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Urgent"], icon: ClipboardList },
    { field: "budgetCode", label: "Budget Code", type: "text", icon: DollarSign },
    { field: "purpose", label: "Purpose", type: "textarea", icon: FileText }
  ];

  const itemFields = [
    { field: "product", label: "Product/Service", type: "text" },
    { field: "quantity", label: "Quantity", type: "number" },
    { field: "unitOfMeasure", label: "Unit of Measure", type: "select", options: ["pcs", "kg", "m", "L", "box"] },
    { field: "specifications", label: "Specifications", type: "textarea" },
    { field: "estimatedCost", label: "Estimated Cost", type: "number" }
  ];

  const priorities = {
    "Low": { color: "bg-green-100 text-green-800", icon: "🟢" },
    "Medium": { color: "bg-yellow-100 text-yellow-800", icon: "🟡" },
    "High": { color: "bg-orange-100 text-orange-800", icon: "🟠" },
    "Urgent": { color: "bg-red-100 text-red-800", icon: "🔴" }
  };

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrentItemChange = (field, value) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const canAddItem = currentItem.product.trim() !== "" && currentItem.quantity > 0;

  const handleAddItem = () => {
    if (!canAddItem) return;
    setItems(prev => [...prev, { ...currentItem, id: Date.now() }]);
    setCurrentItem({
      id: Date.now() + 1,
      product: "",
      quantity: 1,
      specifications: "",
      unitOfMeasure: "",
      estimatedCost: "",
      supplier: null
    });
  };

  const handleEditItem = (item) => {
    setItems(prev => prev.filter(i => i.id !== item.id));
    setCurrentItem(item);
  };

  const handleDeleteItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft && items.length === 0) {
      alert("Add at least one item before submitting.");
      return;
    }
    // Simulate API call
    console.log("Submitting:", { formData, items, status: isDraft ? "draft" : "submitted" });
    alert(isDraft ? "Draft saved!" : "PR submitted successfully!");
  };

  const renderFormField = (fieldDef, value, onChange) => {
    const Icon = fieldDef.icon;
    
    switch (fieldDef.type) {
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldDef.field} className="flex items-center gap-2 text-sm font-medium">
              {Icon && <Icon className="h-4 w-4 text-gray-500" />}
              {fieldDef.label}
            </Label>
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${fieldDef.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {fieldDef.options?.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldDef.field} className="flex items-center gap-2 text-sm font-medium">
              {Icon && <Icon className="h-4 w-4 text-gray-500" />}
              {fieldDef.label}
            </Label>
            <Textarea
              id={fieldDef.field}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
              className="min-h-[80px]"
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldDef.field} className="flex items-center gap-2 text-sm font-medium">
              {Icon && <Icon className="h-4 w-4 text-gray-500" />}
              {fieldDef.label}
            </Label>
            <Input
              id={fieldDef.field}
              type={fieldDef.type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
            />
          </div>
        );
    }
  };

  const BasicInfoForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Fill in the basic details for your purchase requisition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicInfoFields.map((fieldDef) => (
            <div key={fieldDef.field}>
              {renderFormField(
                fieldDef,
                formData[fieldDef.field] || "",
                (value) => handleInputChange(fieldDef.field, value)
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ItemEntryForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Item
        </CardTitle>
        <CardDescription>
          Add items to your purchase requisition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {itemFields.map((fieldDef) => (
            <div key={fieldDef.field}>
              {renderFormField(
                fieldDef,
                currentItem[fieldDef.field] || "",
                (value) => handleCurrentItemChange(fieldDef.field, value)
              )}
            </div>
          ))}
        </div>
        <Button 
          onClick={handleAddItem} 
          disabled={!canAddItem}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  );

  const ItemsList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Added Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product}</h4>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Quantity: {item.quantity} {item.unitOfMeasure}</p>
                      {item.estimatedCost && <p>Est. Cost: ${item.estimatedCost}</p>}
                      {item.specifications && <p>Specs: {item.specifications}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SummaryPanel = () => {
    const totalEstimatedCost = items
      .filter(item => item.estimatedCost)
      .reduce((sum, item) => sum + parseFloat(item.estimatedCost || 0), 0);

    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Request Details</h4>
              <div className="text-sm space-y-1 text-gray-600">
                <p>Department: {formData.department || "Not specified"}</p>
                <p>Requested by: {formData.requestedBy || "Not specified"}</p>
                <p>Date: {formData.requestDate || "Not specified"}</p>
                {formData.priority && (
                  <div className="flex items-center gap-2">
                    <span>Priority:</span>
                    <Badge className={priorities[formData.priority]?.color}>
                      {priorities[formData.priority]?.icon} {formData.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Items ({items.length})</h4>
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="font-medium">{item.product}</div>
                      <div className="text-gray-600">Qty: {item.quantity}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {totalEstimatedCost > 0 && (
              <>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalEstimatedCost.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Estimated Cost</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Purchase Requisition</h1>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSummary(!showSummary)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showSummary ? "Hide" : "Show"} Summary
              </Button>
              <Button variant="outline" onClick={() => handleSubmit(true)}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSubmit(false)}>
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Actions</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-3 mt-6">
                    <Button variant="outline" onClick={() => handleSubmit(true)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={() => handleSubmit(false)}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Section */}
          <div className={`${showSummary ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            {/* Desktop View */}
            <div className="hidden md:block space-y-6">
              <BasicInfoForm />
              <ItemEntryForm />
              <ItemsList />
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="mt-4">
                  <BasicInfoForm />
                </TabsContent>
                
                <TabsContent value="items" className="mt-4 space-y-4">
                  <ItemEntryForm />
                  <ItemsList />
                </TabsContent>
                
                <TabsContent value="summary" className="mt-4">
                  <SummaryPanel />
                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSubmit(true)}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button 
                      onClick={() => handleSubmit(false)}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Desktop Summary Panel */}
          {showSummary && (
            <div className="hidden lg:block lg:col-span-4">
              <SummaryPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { 
//   Save, 
//   Send, 
//   Plus, 
//   Edit2, 
//   Trash2, 
//   Eye, 
//   Menu, 
//   Maximize2, 
//   Minimize2,
//   Package,
//   FileText,
//   Info
// } from "lucide-react";
// import { toast } from "sonner";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { CustomInputField } from "@/componentss/AdditionalComponent/CustomInputField";
// import usePost from "@/hooks/usePostHook";

// import {
//   useBasicInfoFields,
//   itemFields,
//   supplierFields,
//   tabs,
//   priorities,
// } from "../Data/PRData";

// export default function PurchaseRequisitionForm() {
//   const isMobile = useIsMobile();
//   const url = import.meta.env.VITE_API_URL;
//   const { data, loading, error, postData, reset } = usePost();

//   // Basic Info
//   const basicInfoFields = useBasicInfoFields();
//   const [formData, setFormData] = useState({});

//   // Items & Suppliers
//   const emptyItem = {
//     id: 1,
//     PR_PRODUCT: "",
//     PR_QTY: 1,
//     SPECS: "",
//     UOM_SNO: "",
//     supplier: null,
//   };
//   const [currentItem, setCurrentItem] = useState(emptyItem);
//   const [items, setItems] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);

//   // UI State
//   const [showSummary, setShowSummary] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [activeTab, setActiveTab] = useState("basic");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Handlers
//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleCurrentItemChange = (field, value) => {
//     setCurrentItem((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddSupplierToCurrentItem = (supplier, applyToAll) => {
//     setCurrentItem((prev) => ({ ...prev, supplier }));
//     if (applyToAll) {
//       setItems((prev) =>
//         prev.map((item) => ({ ...item, supplier }))
//       );
//     }
//   };

//   const canAddItem = currentItem.PR_PRODUCT.trim() !== "" && currentItem.PR_QTY > 0;

//   const handleAddItem = () => {
//     if (!canAddItem) return;
//     setItems((prev) => [...prev, currentItem]);
//     setCurrentItem((prev) => ({
//       ...emptyItem,
//       id: prev.id + 1,
//     }));
//     toast.success("Item added successfully");
//   };

//   const handleEditItem = (item) => {
//     setItems((prev) => prev.filter((i) => i.id !== item.id));
//     setCurrentItem(item);
//   };

//   const handleDeleteItem = (itemId) => {
//     setItems((prev) => prev.filter((item) => item.id !== itemId));
//     toast.success("Item removed successfully");
//   };

//   const handleSubmit = (isDraft = false) => {
//     if (!isDraft && items.length === 0) {
//       toast.error("Add at least one item before submitting.");
//       return;
//     }
//     const status = isDraft ? "draft" : "submitted";
//     try {
//       postData(`${url}/api/pr`, { formData, items, status });
//       toast.success(`PR ${isDraft ? 'saved as draft' : 'submitted'} successfully`);
//       if (!isDraft) {
//         // Reset all state
//         setFormData({});
//         setItems([]);
//         setSuppliers([]);
//         setCurrentItem({ ...emptyItem, id: 1 });
//         setShowSummary(false);
//         setActiveTab("basic");
//       }
//     } catch (err) {
//       toast.error("Error occurred while processing request");
//     }
//   };

//   // Mobile Header Component
//   const MobileHeader = () => (
//     <div className="sticky top-0 z-50 bg-background border-b lg:hidden">
//       <div className="flex items-center justify-between p-4">
        
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowSummary(!showSummary)}
//           >
//             <Eye className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setIsFullscreen(!isFullscreen)}
//           >
//             {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
//           </Button>
//           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Menu className="h-4 w-4" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right">
//               <SheetHeader>
//                 <SheetTitle>Navigation</SheetTitle>
//                 <SheetDescription>
//                   Switch between form sections
//                 </SheetDescription>
//               </SheetHeader>
//               <div className="mt-6 space-y-2">
//                 {tabs.map((tab) => (
//                   <Button
//                     key={tab.id}
//                     variant={activeTab === tab.id ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => {
//                       setActiveTab(tab.id);
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     {tab.icon}
//                     {tab.label}
//                   </Button>
//                 ))}
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </div>
//   );

//   // Basic Info Form Component
//   const BasicInfoForm = () => (
//     <Card className="shadow-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center gap-2 text-lg">
//           <Info className="h-5 w-5 text-primary" />
//           Basic Information
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {basicInfoFields.map((fieldDef, index) => (
//             <div key={index} className="space-y-2">
//               <Label htmlFor={fieldDef.field} className="text-sm font-medium">
//                 {fieldDef.label}
//                 {fieldDef.require !== false && <span className="text-destructive ml-1">*</span>}
//               </Label>
//               {fieldDef.type === "select" || fieldDef.inputType === "select" ? (
//                 <Select
//                   value={formData[fieldDef.field] || ""}
//                   onValueChange={(value) => handleInputChange(fieldDef.field, value)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder={`Select ${fieldDef.label.toLowerCase()}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {fieldDef.options?.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               ) : fieldDef.type === "textarea" || fieldDef.inputType === "textarea" ? (
//                 <Textarea
//                   id={fieldDef.field}
//                   value={formData[fieldDef.field] || ""}
//                   onChange={(e) => handleInputChange(fieldDef.field, e.target.value)}
//                   placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
//                   className="min-h-[80px]"
//                 />
//               ) : (
//                 <Input
//                   id={fieldDef.field}
//                   type={fieldDef.type || fieldDef.inputType || "text"}
//                   value={formData[fieldDef.field] || ""}
//                   onChange={(e) => handleInputChange(fieldDef.field, e.target.value)}
//                   placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
//                   className="w-full"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );

//   // Item Entry Form Component
//   const ItemEntryForm = () => (
//     <Card className="shadow-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center gap-2 text-lg">
//           <Package className="h-5 w-5 text-primary" />
//           Add Items
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {itemFields.map((fieldDef, index) => (
//             <div key={index} className="space-y-2">
//               <Label htmlFor={fieldDef.field} className="text-sm font-medium">
//                 {fieldDef.label}
//                 {fieldDef.require !== false && <span className="text-destructive ml-1">*</span>}
//               </Label>
//               {fieldDef.type === "select" || fieldDef.inputType === "select" ? (
//                 <Select
//                   value={currentItem[fieldDef.field] || ""}
//                   onValueChange={(value) => handleCurrentItemChange(fieldDef.field, value)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder={`Select ${fieldDef.label.toLowerCase()}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {fieldDef.options?.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               ) : fieldDef.type === "textarea" || fieldDef.inputType === "textarea" ? (
//                 <Textarea
//                   id={fieldDef.field}
//                   value={currentItem[fieldDef.field] || ""}
//                   onChange={(e) => handleCurrentItemChange(fieldDef.field, e.target.value)}
//                   placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
//                   className="min-h-[80px]"
//                 />
//               ) : (
//                 <Input
//                   id={fieldDef.field}
//                   type={fieldDef.type || fieldDef.inputType || "text"}
//                   value={currentItem[fieldDef.field] || ""}
//                   onChange={(e) => {
//                     const value = fieldDef.type === "number" ? 
//                       parseInt(e.target.value) || 0 : 
//                       e.target.value;
//                     handleCurrentItemChange(fieldDef.field, value);
//                   }}
//                   placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
//                   className="w-full"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <Separator />
//         <div className="flex justify-end">
//           <Button
//             onClick={handleAddItem}
//             disabled={!canAddItem}
//             className="min-w-[120px] gap-2"
//           >
//             <Plus className="h-4 w-4" />
//             Add Item
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   // Items List Component
//   const ItemsList = () => (
//     <Card className="shadow-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center justify-between">
//           <span>Added Items</span>
//           <Badge variant="secondary" className="ml-2">
//             {items.length}
//           </Badge>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {items.length === 0 ? (
//           <div className="text-center py-12 text-muted-foreground">
//             <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
//             <h3 className="text-lg font-medium mb-2">No items added yet</h3>
//             <p className="text-sm">Add items using the form above to get started</p>
//           </div>
//         ) : (
//           <ScrollArea className="h-[400px] w-full">
//             <div className="space-y-4 pr-4">
//               {items.map((item) => (
//                 <Card key={item.id} className="border-l-4 border-l-primary/50 bg-muted/20">
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1 space-y-3">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                           <div>
//                             <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                               Product
//                             </Label>
//                             <p className="font-medium mt-1">{item.PR_PRODUCT}</p>
//                           </div>
//                           <div>
//                             <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                               Quantity
//                             </Label>
//                             <p className="font-medium mt-1">{item.PR_QTY}</p>
//                           </div>
//                           <div>
//                             <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                               UOM
//                             </Label>
//                             <p className="font-medium mt-1">{item.UOM_SNO || "N/A"}</p>
//                           </div>
//                           <div>
//                             <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                               Supplier
//                             </Label>
//                             <p className="font-medium mt-1">
//                               {item.supplier?.name || (
//                                 <span className="text-muted-foreground">Not assigned</span>
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                         {item.SPECS && (
//                           <div className="border-t pt-3">
//                             <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                               Specifications
//                             </Label>
//                             <p className="text-sm text-muted-foreground mt-1">{item.SPECS}</p>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex gap-2 ml-4">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleEditItem(item)}
//                           className="h-8 w-8 p-0"
//                         >
//                           <Edit2 className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDeleteItem(item.id)}
//                           className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   );

//   // Summary Panel Component
//   const SummaryPanel = () => (
//     <Card className="sticky top-6 shadow-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="text-lg">Summary</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="space-y-3">
//           <div className="flex items-center justify-between py-2 border-b">
//             <span className="text-sm font-medium text-muted-foreground">Total Items</span>
//             <Badge variant="outline" className="font-medium">
//               {items.length}
//             </Badge>
//           </div>
//           <div className="flex items-center justify-between py-2 border-b">
//             <span className="text-sm font-medium text-muted-foreground">Status</span>
//             <Badge variant="secondary">
//               Draft
//             </Badge>
//           </div>
//         </div>

//         {items.length > 0 && (
//           <>
//             <Separator />
//             <div className="space-y-3">
//               <h4 className="text-sm font-medium">Recent Items</h4>
//               <div className="space-y-2">
//                 {items.slice(-3).map((item) => (
//                   <div key={item.id} className="p-3 bg-muted/50 rounded-lg border">
//                     <p className="font-medium text-sm truncate">{item.PR_PRODUCT}</p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Qty: {item.PR_QTY} {item.UOM_SNO && `• ${item.UOM_SNO}`}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );

//   // Footer Component
//   const FormFooter = () => (
//     <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
//           <div className="flex items-center gap-3 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <Package className="h-4 w-4" />
//               <span className="font-medium">
//                 {items.length} item{items.length !== 1 ? 's' : ''} added
//               </span>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               onClick={() => handleSubmit(true)}
//               disabled={loading}
//               className="min-w-[120px] gap-2"
//             >
//               <Save className="h-4 w-4" />
//               Save Draft
//             </Button>
//             <Button
//               onClick={() => handleSubmit(false)}
//               disabled={loading || items.length === 0}
//               className="min-w-[130px] gap-2"
//             >
//               <Send className="h-4 w-4" />
//               Submit PR
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
//       {/* Mobile Header */}
//       {isMobile && <MobileHeader />}

//       <div className="container mx-auto py-6 px-4 pb-24">
//         {/* Desktop Header */}
//         {/* {!isMobile && (
//           <div className="flex items-center justify-between mb-8">
           
//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowSummary(!showSummary)}
//                 className="gap-2"
//               >
//                 <Eye className="h-4 w-4" />
//                 {showSummary ? 'Hide' : 'Show'} Summary
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="gap-2"
//               >
//                 {isFullscreen ? (
//                   <>
//                     <Minimize2 className="h-4 w-4" />
//                     Exit Fullscreen
//                   </>
//                 ) : (
//                   <>
//                     <Maximize2 className="h-4 w-4" />
//                     Fullscreen
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         )} */}

//         {/* Main Content */}
//         <div className={`grid gap-8 ${showSummary && !isMobile ? 'lg:grid-cols-4' : 'grid-cols-1'}`}>
//           {/* Form Content */}
//           <div className={showSummary && !isMobile ? 'lg:col-span-3' : 'col-span-1'}>
//             {isMobile ? (
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 mb-6">
//                   <TabsTrigger value="basic" className="flex items-center gap-2">
//                     <Info className="h-4 w-4" />
//                     Basic Info
//                   </TabsTrigger>
//                   <TabsTrigger value="items" className="flex items-center gap-2">
//                     <Package className="h-4 w-4" />
//                     Items
//                   </TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="basic">
//                   <BasicInfoForm />
//                 </TabsContent>
//                 <TabsContent value="items" className="space-y-8">
//                   <ItemEntryForm />
//                   <ItemsList />
//                 </TabsContent>
//               </Tabs>
//             ) : (
//               <div className="space-y-8">
//                 <BasicInfoForm />
//                 <ItemEntryForm />
//                 <ItemsList />
//               </div>
//             )}
//           </div>

//           {/* Desktop Summary Panel */}
//           {showSummary && !isMobile && (
//             <div className="lg:col-span-1">
//               <SummaryPanel />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Summary Sheet */}
//       {isMobile && (
//         <Sheet open={showSummary} onOpenChange={setShowSummary}>
//           <SheetContent side="right" className="w-full sm:max-w-md">
//             <SheetHeader className="mb-6">
//               <SheetTitle>Summary</SheetTitle>
//               <SheetDescription>
//                 Review your purchase requisition details
//               </SheetDescription>
//             </SheetHeader>
//             <SummaryPanel />
//           </SheetContent>
//         </Sheet>
//       )}

//       {/* Footer */}
//       <FormFooter />
//     </div>
//   );
// }
