import React, { useState } from "react";
import { CalendarIcon, Plus, Trash2, DollarSign } from "lucide-react";
import { CustomInputField } from "@/componentss/AdditionalComponent/CustomInputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BudgetRequestPage() {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    requestedBy: "",
    email: "",
    requestDate: "",
    neededBy: "",
    priority: "",
    description: "",
    justification: "",
  });

  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", quantity: 1, unitPrice: 0, category: "" }
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Department options
  const departmentOptions = [
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "engineering", label: "Engineering" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
  ];

  // Priority options
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Category options for line items
  const categoryOptions = [
    { value: "software", label: "Software" },
    { value: "hardware", label: "Hardware" },
    { value: "services", label: "Services" },
    { value: "training", label: "Training" },
    { value: "travel", label: "Travel" },
    { value: "other", label: "Other" },
  ];

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Add new line item
  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id)) + 1;
    setLineItems([...lineItems, {
      id: newId,
      description: "",
      quantity: 1,
      unitPrice: 0,
      category: ""
    }]);
  };

  // Remove line item
  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  // Update line item
  const updateLineItem = (id, field, value) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculate total amount
  const calculateTotal = () => {
    return lineItems.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      'title', 'department', 'requestedBy', 'email', 
      'requestDate', 'neededBy', 'priority', 'description', 'justification'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Date validation
    if (formData.requestDate && formData.neededBy) {
      if (new Date(formData.neededBy) <= new Date(formData.requestDate)) {
        newErrors.neededBy = "Needed by date must be after request date";
      }
    }

    // Line items validation
    const hasValidLineItems = lineItems.some(item => 
      item.description && item.category && item.quantity > 0 && item.unitPrice > 0
    );

    if (!hasValidLineItems) {
      newErrors.lineItems = "At least one valid line item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const budgetRequest = {
      ...formData,
      lineItems: lineItems.filter(item => item.description), // Only include items with description
      totalAmount: calculateTotal(),
      submittedAt: new Date().toISOString(),
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Budget Request Submitted:", budgetRequest);
      alert("Budget request submitted successfully!");
      
      // Reset form
      setFormData({
        title: "", department: "", requestedBy: "", email: "",
        requestDate: "", neededBy: "", priority: "", description: "", justification: "",
      });
      setLineItems([{ id: 1, description: "", quantity: 1, unitPrice: 0, category: "" }]);
      setErrors({});
      
    } catch (error) {
      console.error("Error submitting budget request:", error);
      alert("Error submitting budget request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = () => {
    const draftData = {
      ...formData,
      lineItems,
      totalAmount: calculateTotal(),
      status: "draft",
      savedAt: new Date().toISOString(),
    };
    
    // Save to localStorage or send to API
    localStorage.setItem('budgetRequestDraft', JSON.stringify(draftData));
    alert("Budget request saved as draft!");
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "secondary";
      case "medium": return "default";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8 w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
         </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInputField
                field="title"
                label="Budget Title"
                placeholder="e.g. Q2 Marketing Campaign"
                value={formData.title}
                onChange={(value) => handleFieldChange('title', value)}
                error={errors.title}
                require={true}
              />
              
              <CustomInputField
                field="department"
                label="Department"
                type="select"
                options={departmentOptions}
                value={formData.department}
                onChange={(value) => handleFieldChange('department', value)}
                error={errors.department}
                require={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInputField
                field="requestedBy"
                label="Requested By"
                placeholder="Full name"
                value={formData.requestedBy}
                onChange={(value) => handleFieldChange('requestedBy', value)}
                error={errors.requestedBy}
                require={true}
              />
              
              {/* <CustomInputField
                field="email"
                label="Email"
                type="email"
                placeholder="email@company.com"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value)}
                error={errors.email}
                require={true}
              /> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomInputField
                field="requestDate"
                label="Request Date"
                type="date"
                value={formData.requestDate}
                onChange={(value) => handleFieldChange('requestDate', value)}
                error={errors.requestDate}
                require={true}
              />

              <CustomInputField
                field="neededBy"
                label="Needed By"
                type="date"
                value={formData.neededBy}
                onChange={(value) => handleFieldChange('neededBy', value)}
                error={errors.neededBy}
                require={true}
              />

              <div className="space-y-2">
                <CustomInputField
                  field="priority"
                  label="Priority"
                  type="select"
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => handleFieldChange('priority', value)}
                  error={errors.priority}
                  require={true}
                />
                {formData.priority && (
                  <Badge variant={getPriorityBadgeVariant(formData.priority)} className="w-fit">
                    {priorityOptions.find(p => p.value === formData.priority)?.label}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
            <CardDescription>
              Break down your budget request into line items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                  <div className="col-span-4">
                    <CustomInputField
                      field={`description-${item.id}`}
                      label="Description"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(value) => updateLineItem(item.id, 'description', value)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <CustomInputField
                      field={`category-${item.id}`}
                      label="Category"
                      type="select"
                      options={categoryOptions}
                      value={item.category}
                      onChange={(value) => updateLineItem(item.id, 'category', value)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <CustomInputField
                      field={`quantity-${item.id}`}
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(value) => updateLineItem(item.id, 'quantity', parseInt(value) || 1)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <CustomInputField
                      field={`unitPrice-${item.id}`}
                      label="Unit Price"
                      type="number"
                      placeholder="0.00"
                      value={item.unitPrice}
                      onChange={(value) => updateLineItem(item.id, 'unitPrice', parseFloat(value) || 0)}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Total</label>
                      <div className="text-sm font-semibold py-2 px-3 bg-muted rounded flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {errors.lineItems && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.lineItems}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="outline" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
                
                <div className="text-right space-y-2">
                  <div className="text-lg font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />
                    Total: {calculateTotal().toFixed(2)}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {lineItems.filter(item => item.description).length} items
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ADD THIS MISSING SECTION - Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Provide detailed description and justification for your budget request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CustomInputField
              field="description"
              label="Description"
              type="textarea"
              placeholder="Provide a detailed description of what this budget will be used for..."
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              error={errors.description}
              require={true}
            />
            
            <CustomInputField
              field="justification"
              label="Business Justification"
              type="textarea"
              placeholder="Explain why this budget is necessary and how it will benefit the organization..."
              value={formData.justification}
              onChange={(value) => handleFieldChange('justification', value)}
              error={errors.justification}
              require={true}
            />
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex justify-between items-center pt-6">
          <div className="text-sm text-muted-foreground">
            Fields marked with <span className="text-red-500">*</span> are required
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
