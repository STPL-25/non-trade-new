import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "@/components/ui/dialog";
import {  Table,  TableBody,  TableCell,  TableHead,  TableHeader,  TableRow, } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  Plus,  Upload,  Save,  Building2,  Package,  Calculator,  FileText,  Users,  ShoppingCart,  Search,  Edit,  X,} from "lucide-react";
import useFetch from "@/hooks/useFetchHook";
import useUpdate from "@/hooks/useUpdateHook";
import { purchaseTeamFields } from "@/Data/PRData";

const PurchaseTeamSystem = () => {
  const [selectedPR, setSelectedPR] = useState(null);
  const [prItems, setPrItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemSuppliers, setItemSuppliers] = useState({}); 
  const [quotations, setQuotations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false);
  const [showQuotationDialog, setShowQuotationDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const { updateData } = useUpdate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const { data: prData, loading: prLoading } = useFetch(
    `${apiUrl}/api/pr/getbasic`
  );

  const { loading: supplierLoading } = useFetch(
    `${apiUrl}/api/suppliers/getall`
  );
  
  const { data:supplierDatas } = useFetch(
    `${apiUrl}/api/common/supplier`
  );

  const { data: prItemsData, loading: prItemsLoading } = useFetch(
    `${apiUrl}/api/pr/getiemsinfo`,selectedPR
    
  );

  useEffect(() => {
    if (prItemsData?.data) {
      const itemsWithDetails = prItemsData.data.map((item) => ({
        ...item,
        editedQty: parseFloat(item.PR_QTY)||1,
        hsn: "",
        gstPercent: 18,
        unitPrice: "",
        totalPrice: "",
        specifications: item.SPECS || "",
        quotationImages: [],
        suppliers: [], // Suppliers for this specific item
      }));
      setPrItems(itemsWithDetails);
      setSelectedItems([]);
      setItemSuppliers({});
      setQuotations({});
    }
  }, [prItemsData]);

  useEffect(() => {
    console.log(supplierDatas)
     if (supplierDatas?.data) {
      const transformedSuppliers = supplierDatas?.data?.map((supplier) => ({
        id: supplier.SLR_SNO,
        code: supplier.SLR_CODE,
        name: supplier.SLR_NAME,
        contact: supplier.SLR_CONTACT_NO,
        email: supplier.SLR_EMAIL,
        phone: supplier.SLR_PHONE_NO,
        address: supplier.SLR_ADDRESS + supplier.SLR_ADDRESS2,
        category: supplier.CATEGORY||"",
        gst: supplier.SLR_GST_NO,
        pan: supplier.SLR_PAN_NO,
      }));
      console.log(transformedSuppliers)
      setSuppliers(transformedSuppliers);
    }
      
    
  }, [supplierDatas]);

  const transformedPRData = prData
    ? prData.data
        .filter((pr) => pr.STATUS?.trim() === "P")
        .map((pr) => ({
          ...pr,
          id: pr.PR_QRCODE,
          // status: "Approved",
          dateRequested: pr.REQ_DATE,
        }))
    : [];

  const filteredPRs = transformedPRData.filter(
    (pr) =>
      pr.PR_QRCODE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.DEPT?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.ECNO?.toString().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(supplierSearchTerm.toLowerCase()) 
      // supplier.category.toLowerCase().includes(supplierSearchTerm.toLowerCase())
  );

  const handlePRSelect = (prQRCode) => {
    setSelectedPR(prQRCode);
    setSelectedItems([]);
    setItemSuppliers({});
    setQuotations({});
  };

  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      // Remove suppliers for this item
      setItemSuppliers((prev) => {
        const newItemSuppliers = { ...prev };
        delete newItemSuppliers[itemId];
        return newItemSuppliers;
      });
    }
  };

  const handleBulkItemSelection = (checked) => {
    if (checked) {
      setSelectedItems(prItems.map((item) => item.PR_SNO));
    } else {
      setSelectedItems([]);
      setItemSuppliers({});
    }
  };

  const handleAddSupplierToItem = (itemId, supplierId) => {
    setItemSuppliers((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), supplierId],
    }));

    // Initialize quotation for this item-supplier combination
    const itemSupplierKey = `${itemId}_${supplierId}`;
    setQuotations((prev) => ({
      ...prev,
      [itemSupplierKey]: {
        unitPrice: "",
        gstPercent: 18,
        deliveryDays: "",
        remarks: "",
        quotationImages: [],
        validityDays: 30,
        termsConditions: "",
        discount: 0,
        freight: 0,
        packaging: 0,
      },
    }));
  };

  const handleRemoveSupplierFromItem = (itemId, supplierId) => {
    setItemSuppliers((prev) => ({
      ...prev,
      [itemId]: prev[itemId]?.filter((id) => id !== supplierId) || [],
    }));

    // Remove quotation for this item-supplier combination
    const itemSupplierKey = `${itemId}_${supplierId}`;
    setQuotations((prev) => {
      const newQuotations = { ...prev };
      delete newQuotations[itemSupplierKey];
      return newQuotations;
    });
  };

  const handleBulkSupplierAdd = (supplierId) => {
    selectedItems.forEach((itemId) => {
      if (!itemSuppliers[itemId]?.includes(supplierId)) {
        handleAddSupplierToItem(itemId, supplierId);
      }
    });
    setShowAddSupplierDialog(false);
  };

  const handleItemEdit = (item, field, value) => {
    setPrItems((prev) =>
      prev.map((i) => (i.PR_SNO === item.PR_SNO ? { ...i, [field]: value } : i))
    );
  };

  const handleQuotationUpdate = (itemId, supplierId, field, value) => {
    const itemSupplierKey = `${itemId}_${supplierId}`;
    setQuotations((prev) => ({
      ...prev,
      [itemSupplierKey]: {
        ...prev[itemSupplierKey],
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (itemId, supplierId, files) => {
    const itemSupplierKey = `${itemId}_${supplierId}`;
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setQuotations((prev) => ({
      ...prev,
      [itemSupplierKey]: {
        ...prev[itemSupplierKey],
        quotationImages: [
          ...(prev[itemSupplierKey]?.quotationImages || []),
          ...newImages,
        ],
      },
    }));
  };

  const handleImageRemove = (itemId, supplierId, imageIndex) => {
    const itemSupplierKey = `${itemId}_${supplierId}`;
    setQuotations((prev) => ({
      ...prev,
      [itemSupplierKey]: {
        ...prev[itemSupplierKey],
        quotationImages:
          prev[itemSupplierKey]?.quotationImages?.filter(
            (_, index) => index !== imageIndex
          ) || [],
      },
    }));
  };

  const calculateItemTotal = (itemId, supplierId) => {
    const itemSupplierKey = `${itemId}_${supplierId}`;
    const quotation = quotations[itemSupplierKey];
    const item = prItems.find((i) => i.PR_SNO == itemId);
  console.log(prItems)
    if (!quotation || !item || !quotation.unitPrice) return 0;

    const unitPrice = parseFloat(quotation.unitPrice) || 0;
    const qty = parseFloat(item.editedQty) || 0;
    const gst = parseFloat(quotation.gstPercent) || 0;
    const discount = parseFloat(quotation.discount) || 0;
    const freight = parseFloat(quotation.freight) || 0;
    const packaging = parseFloat(quotation.packaging) || 0;

    const subtotal = unitPrice * qty;
    console.log(subtotal);
    const discountAmount = (subtotal * discount) / 100 || 0;
    const afterDiscount = subtotal - discountAmount;
    const gstAmount = (afterDiscount * gst) / 100 || 0;
    const total = afterDiscount + gstAmount + freight + packaging;
    console.log(unitPrice,qty,gst,discount,freight,packaging,discountAmount,afterDiscount,gstAmount,total);

    return total;
  };

  const calculateSupplierTotal = (supplierId) => {
    let total = 0;
    Object.keys(itemSuppliers).forEach((itemId) => {
      if (itemSuppliers[itemId].includes(supplierId)) {
        total += calculateItemTotal(itemId, supplierId);
      }
    });
    console.log(total);
    return total;
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : `Supplier ${supplierId}`;
  };

  const getItemsForSupplier = (supplierId) => {
    return Object.keys(itemSuppliers).filter((itemId) =>
      itemSuppliers[itemId].includes(supplierId)
    );
  };

  const getAllSelectedSuppliers = () => {
    const supplierSet = new Set();
    Object.values(itemSuppliers).forEach((supplierList) => {
      supplierList.forEach((supplierId) => supplierSet.add(supplierId));
    });
    return Array.from(supplierSet);
  };

  const handleSubmitRFQ = async () => {
    try {
      const rfqData = {
        prQRCode: selectedPR,
        items: prItems.filter((item) => selectedItems.includes(item.PR_SNO)),
        itemSuppliers: itemSuppliers,
        quotations: quotations,
        submittedAt: new Date().toISOString(),
        submittedBy: "Purchase Team", // Add user context
      };

      
      // Reset form
      setSelectedPR(null);
      setPrItems([]);
      setSelectedItems([]);
      setItemSuppliers({});
      setQuotations({});

      alert("RFQ submitted successfully!");
    } catch (error) {
      console.error("Error submitting RFQ:", error);
      alert("Error submitting RFQ. Please try again.");
    }
  };

  if (prLoading || supplierLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PR Selection Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                   PRs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search PRs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPRs.map((pr) => (
                    <div
                      key={pr.PR_QRCODE}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPR === pr.PR_QRCODE
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePRSelect(pr.PR_QRCODE)}
                    >
                      <div className="font-medium text-sm">{pr.PR_QRCODE}</div>
                      <div className="text-xs text-gray-500">{pr.DEPT}</div>
                      <div className="text-xs text-gray-500">
                        ECNO: {pr.ECNO}
                      </div>
                      <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                        Approved
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPR ? (
              <div className="space-y-6">
                {/* PR Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {selectedPR}
                      </span>
                    
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Tabs for different sections */}
                <Tabs defaultValue="items" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="items">
                      Items & Specifications
                    </TabsTrigger>
                    <TabsTrigger value="suppliers">
                      Supplier Management
                    </TabsTrigger>
                    <TabsTrigger value="quotations">
                      Quotation Comparison
                    </TabsTrigger>
                  </TabsList>

                  {/* Items Tab */}
                  <TabsContent value="items" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            PR Items ({selectedItems.length} selected)
                          </span>
                          <div className="flex items-center gap-2">
                            {selectedItems?.length > 0 && (
                              <Button
                                onClick={() => setShowAddSupplierDialog(true)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Suppliers
                              </Button>
                            )}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="select-all"
                                checked={
                                  selectedItems.length === prItems.length &&
                                  prItems.length > 0
                                }
                                onCheckedChange={handleBulkItemSelection}
                              />
                              <Label htmlFor="select-all" className="text-sm">
                                Select All
                              </Label>
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {prItemsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {prItems.map((item) => (
                              <Card
                                key={item.PR_SNO}
                                className={`border-l-4 ${
                                  selectedItems.includes(item.PR_SNO)
                                    ? "border-l-blue-500 bg-blue-50"
                                    : "border-l-gray-300"
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <Checkbox
                                      checked={selectedItems.includes(
                                        item.PR_SNO
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleItemSelection(
                                          item.PR_SNO,
                                          checked
                                        )
                                      }
                                      className="mt-1"
                                    />

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                      <div>
                                        <Label className="text-xs font-medium text-gray-500">
                                          Product
                                        </Label>
                                        <p className="font-medium">
                                          {item.PR_PRODUCT}
                                        </p>
                                        {item.PR_CODE && (
                                          <p className="text-sm text-gray-600">
                                            Code: {item.PR_CODE}
                                          </p>
                                        )}
                                      </div>

                                      <div>
                                        <Label className="text-xs font-medium text-gray-500">
                                          Quantity
                                        </Label>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="number"
                                            value={item.editedQty}
                                            onChange={(e) =>
                                              handleItemEdit(
                                                item,
                                                "editedQty",
                                                e.target.value
                                              )
                                            }
                                            className="w-20"
                                          />
                                          <span className="text-sm text-gray-600">
                                            {item.UOM_SNO || "units"}
                                          </span>
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-xs font-medium text-gray-500">
                                          HSN Code
                                        </Label>
                                        <Input
                                          type="text"
                                          placeholder="HSN Code"
                                          value={item.hsn}
                                          onChange={(e) =>
                                            handleItemEdit(
                                              item,
                                              "hsn",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div>
                                        <Label className="text-xs font-medium text-gray-500">
                                          GST %
                                        </Label>
                                        <Input
                                          type="number"
                                          value={item.gstPercent}
                                          onChange={(e) =>
                                            handleItemEdit(
                                              item,
                                              "gstPercent",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {item.SPECS && (
                                    <div className="mt-4">
                                      <Label className="text-xs font-medium text-gray-500">
                                        Specifications
                                      </Label>
                                      <Textarea
                                        value={item.specifications}
                                        onChange={(e) =>
                                          handleItemEdit(
                                            item,
                                            "specifications",
                                            e.target.value
                                          )
                                        }
                                        className="mt-1"
                                        rows={2}
                                      />
                                    </div>
                                  )}

                                  {/* Show suppliers for this item */}
                                  {selectedItems.includes(item.PR_SNO) &&
                                    itemSuppliers[item.PR_SNO]?.length > 0 && (
                                      <div className="mt-4 border-t pt-4">
                                        <Label className="text-xs font-medium text-gray-500 mb-2 block">
                                          Assigned Suppliers (
                                          {itemSuppliers[item.PR_SNO].length})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                          {itemSuppliers[item.PR_SNO].map(
                                            (supplierId) => {
                                              const supplier = suppliers.find(
                                                (s) => s.id === supplierId
                                              );
                                              return (
                                                <Badge
                                                  key={supplierId}
                                                  variant="outline"
                                                  className="flex items-center gap-1"
                                                >
                                                  {supplier?.name ||
                                                    `Supplier ${supplierId}`}
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0 hover:bg-red-100"
                                                    onClick={() =>
                                                      handleRemoveSupplierFromItem(
                                                        item.PR_SNO,
                                                        supplierId
                                                      )
                                                    }
                                                  >
                                                    <X className="h-3 w-3 text-red-500" />
                                                  </Button>
                                                </Badge>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Suppliers Tab */}
                  <TabsContent value="suppliers" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Supplier Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getAllSelectedSuppliers().length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                              No suppliers assigned
                            </p>
                            <p className="text-sm text-gray-400">
                              Select items and add suppliers to get started
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getAllSelectedSuppliers().map((supplierId) => {
                              const supplier = suppliers.find(
                                (s) => s.id === supplierId
                              );
                              const assignedItems =
                                getItemsForSupplier(supplierId);

                              return (
                                <Card
                                  key={supplierId}
                                  className="border-l-4 border-l-green-500"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <h4 className="font-medium text-lg">
                                          {supplier?.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          {supplier?.category}
                                        </p>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800">
                                        {assignedItems.length} items
                                      </Badge>
                                    </div>

                                    {supplier && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                        <div>
                                          <p>
                                            <strong>Contact:</strong>{" "}
                                            {supplier.contact}
                                          </p>
                                          <p>
                                            <strong>Email:</strong>{" "}
                                            {supplier.email}
                                          </p>
                                        </div>
                                        <div>
                                          <p>
                                            <strong>Phone:</strong>{" "}
                                            {supplier.phone}
                                          </p>
                                         
                                        </div>
                                      </div>
                                    )}

                                    <div className="mb-4">
                                      <Label className="text-sm font-medium mb-2 block">
                                        Assigned Items:
                                      </Label>
                                      <div className="flex flex-wrap gap-2">
                                        {assignedItems.map((itemId) => {
                                          const item = prItems.find(
                                            (i) => i.PR_SNO === itemId
                                          );
                                          return (
                                            <Badge
                                              key={itemId}
                                              variant="outline"
                                            >
                                              {item?.PR_PRODUCT}
                                            </Badge>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => {
                                        setCurrentSupplier(supplierId);
                                        setShowQuotationDialog(true);
                                      }}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Manage Quotations
                                    </Button>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Quotations Tab */}
                  <TabsContent value="quotations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-5 w-5" />
                          Quotation Comparison
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getAllSelectedSuppliers().length === 0 ? (
                          <div className="text-center py-8">
                            <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                              No quotations to compare
                            </p>
                            <p className="text-sm text-gray-400">
                              Add suppliers and request quotations first
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Item-wise comparison */}
                            {prItems
                              .filter((item) =>
                                selectedItems.includes(item.PR_SNO)
                              )
                              .map((item) => {
                                const itemSuppliersList =
                                  itemSuppliers[item.PR_SNO] || [];

                                return (
                                  <Card
                                    key={item.PR_SNO}
                                    className="border-l-4 border-l-blue-500"
                                  >
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        {item.PR_PRODUCT}
                                      </CardTitle>
                                      <p className="text-sm text-gray-600">
                                        Quantity: {item.editedQty}{" "}
                                        {item.UOM_SNO || "units"}
                                      </p>
                                    </CardHeader>
                                    <CardContent>
                                      {itemSuppliersList.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">
                                          No suppliers assigned to this item
                                        </p>
                                      ) : (
                                        <div className="overflow-x-auto">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>
                                                  Unit Price
                                                </TableHead>
                                                <TableHead>GST %</TableHead>
                                                <TableHead>
                                                  Discount %
                                                </TableHead>
                                                <TableHead>
                                                  Total Amount
                                                </TableHead>
                                                <TableHead>
                                                  Delivery Days
                                                </TableHead>
                                                <TableHead>Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {itemSuppliersList.map(
                                                (supplierId) => {
                                                  const supplier =
                                                    suppliers.find(
                                                      (s) => s.id === supplierId
                                                    );
                                                  const itemSupplierKey = `${item.PR_SNO}_${supplierId}`;
                                                  const quotation =
                                                    quotations[itemSupplierKey];
                                                  const total =
                                                    calculateItemTotal(
                                                      item.PR_SNO,
                                                      supplierId
                                                    );

                                                  return (
                                                    <TableRow key={supplierId}>
                                                      <TableCell className="font-medium">
                                                        {supplier?.name}
                                                      </TableCell>
                                                      <TableCell>
                                                        {quotation?.unitPrice ? (
                                                          `₹${quotation.unitPrice}`
                                                        ) : (
                                                          <span className="text-gray-400">
                                                            Not quoted
                                                          </span>
                                                        )}
                                                      </TableCell>
                                                      <TableCell>
                                                        {quotation?.gstPercent ||
                                                          18}
                                                        %
                                                      </TableCell>
                                                      <TableCell>
                                                        {quotation?.discount ||
                                                          0}
                                                        %
                                                      </TableCell>
                                                      <TableCell className="font-medium">
                                                        {quotation?.unitPrice ? (
                                                          `₹${total?.toFixed(
                                                            2
                                                          )}`
                                                        ) : (
                                                          <span className="text-gray-400">
                                                            -
                                                          </span>
                                                        )}
                                                      </TableCell>
                                                      <TableCell>
                                                        {quotation?.deliveryDays ? (
                                                          `${quotation.deliveryDays} days`
                                                        ) : (
                                                          <span className="text-gray-400">
                                                            -
                                                          </span>
                                                        )}
                                                      </TableCell>
                                                      <TableCell>
                                                        <Button
                                                          variant="outline"
                                                          size="sm"
                                                          onClick={() => {
                                                            setCurrentSupplier(
                                                              supplierId
                                                            );
                                                            setCurrentItem(
                                                              item.PR_SNO
                                                            );
                                                            setShowQuotationDialog(
                                                              true
                                                            );
                                                          }}
                                                        >
                                                          <Edit className="h-4 w-4" />
                                                        </Button>
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                }
                                              )}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                );
                              })}

                            {/* Supplier totals */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Supplier Totals</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {getAllSelectedSuppliers().map(
                                    (supplierId) => {
                                      const supplier = suppliers.find(
                                        (s) => s.id === supplierId
                                      );
                                      const total =
                                        calculateSupplierTotal(supplierId);

                                      return (
                                        <Card
                                          key={supplierId}
                                          className="border-l-4 border-l-purple-500"
                                        >
                                          <CardContent className="p-4">
                                            <h4 className="font-medium">
                                              {supplier?.name}
                                            </h4>
                                            <p className="text-2xl font-bold text-purple-600">
                                              ₹{total?.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              {
                                                getItemsForSupplier(supplierId)
                                                  .length
                                              }{" "}
                                              items
                                            </p>
                                          </CardContent>
                                        </Card>
                                      );
                                    }
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Submit RFQ Button */}
                    {getAllSelectedSuppliers().length > 0 &&
                      selectedItems.length > 0 && (
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSubmitRFQ}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="lg"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Submit RFQ
                          </Button>
                        </div>
                      )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Select a Purchase Requisition
                  </h3>
                  <p className="text-gray-600">
                    Choose a PR from the sidebar to start managing quotations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add Supplier Dialog */}
      <Dialog
        open={showAddSupplierDialog}
        onOpenChange={setShowAddSupplierDialog}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Suppliers to Selected Items</DialogTitle>
            <DialogDescription>
              Select suppliers to assign to the selected items (
              {selectedItems.length} items selected)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
                value={supplierSearchTerm}
                onChange={(e) => setSupplierSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleBulkSupplierAdd(supplier.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{supplier.name}</h4>
                      <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Code:</strong> {supplier.code}
                      </p>
                    
                      <p>
                        <strong>Contact:</strong> {supplier.contact}
                      </p>
                      <p>
                        <strong>Email:</strong> {supplier.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {supplier.phone}
                      </p>
                    </div>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">
                      {supplier.paymentTerms}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSupplierDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quotation Management Dialog */}
      <Dialog open={showQuotationDialog} onOpenChange={setShowQuotationDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Quotations - {getSupplierName(currentSupplier)}
            </DialogTitle>
            <DialogDescription>
              Add pricing and quotation details for assigned items
            </DialogDescription>
          </DialogHeader>

          {currentSupplier && (
            <div className="space-y-6">
              {/* Items for this supplier */}
              <div>
                <h4 className="font-medium mb-4">Items & Pricing</h4>
                <div className="space-y-4">
                  {(currentItem
                    ? [currentItem]
                    : getItemsForSupplier(currentSupplier)
                  ).map((itemId) => {
                    const item = prItems.find((i) => i.PR_SNO === itemId);
                    const itemSupplierKey = `${itemId}_${currentSupplier}`;
                    const quotation = quotations[itemSupplierKey] || {};
                   console.log(quotation)
                    return (
                      <Card
                        key={itemId}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {item?.PR_PRODUCT}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Quantity: {item?.editedQty}{" "}
                            {item?.UOM_SNO || "units"}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Pricing Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                              <Label className="text-sm font-medium">
                                Unit Price (₹)
                              </Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={quotation.unitPrice || ""}
                                onChange={(e) =>
                                  handleQuotationUpdate(
                                    itemId,
                                    currentSupplier,
                                    "unitPrice",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                GST %
                              </Label>
                              <Input
                                type="number"
                                value={quotation.gstPercent || 18}
                                onChange={(e) =>
                                  handleQuotationUpdate(
                                    itemId,
                                    currentSupplier,
                                    "gstPercent",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Discount %
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={quotation.discount || ""}
                                onChange={(e) =>
                                  handleQuotationUpdate(
                                    itemId,
                                    currentSupplier,
                                    "discount",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Freight (₹)
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={quotation.freight || ""}
                                onChange={(e) =>
                                  handleQuotationUpdate(
                                    itemId,
                                    currentSupplier,
                                    "freight",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Packaging (₹)
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={quotation.packaging || ""}
                                onChange={(e) =>
                                  handleQuotationUpdate(
                                    itemId,
                                    currentSupplier,
                                    "packaging",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Delivery Days
                              </Label>
                              <Input
                                type="number"
                                placeholder="Days"
                                value={quotation.deliveryDays || ""}
                                onChange={(e) =>
                                  handleQuotationUpdate(
                                    itemId,
                                    currentSupplier,
                                    "deliveryDays",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Remarks */}
                          <div>
                            <Label className="text-sm font-medium">
                              Remarks
                            </Label>
                            <Textarea
                              placeholder="Any specific remarks or conditions..."
                              value={quotation.remarks || ""}
                              onChange={(e) =>
                                handleQuotationUpdate(
                                  itemId,
                                  currentSupplier,
                                  "remarks",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </div>

                          {/* Image Upload */}
                          <div>
                            <Label className="text-sm font-medium">
                              Quotation Images
                            </Label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                multiple
                                onChange={(e) =>
                                  handleImageUpload(
                                    itemId,
                                    currentSupplier,
                                    e.target.files
                                  )
                                }
                                className="hidden"
                                id={`image-upload-${itemId}`}
                              />
                              <label
                                htmlFor={`image-upload-${itemId}`}
                                className="cursor-pointer block text-center"
                              >
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                  Click to upload quotation images/documents
                                </p>
                                <p className="text-xs text-gray-500">
                                  Multiple files supported (Images, PDF)
                                </p>
                              </label>
                            </div>

                            {/* Display uploaded images */}
                            {quotation.quotationImages?.length > 0 && (
                              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quotation.quotationImages.map(
                                  (image, index) => (
                                    <div key={index} className="relative group">
                                      <div className="border rounded-lg p-2 bg-gray-50">
                                        {image.file?.type?.startsWith(
                                          "image/"
                                        ) ? (
                                          <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-20 object-cover rounded cursor-pointer"
                                            onClick={() => {
                                              setCurrentImage(image.url);
                                              setShowImageDialog(true);
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded">
                                            <FileText className="h-8 w-8 text-gray-500" />
                                          </div>
                                        )}
                                        <p className="text-xs text-gray-600 mt-1 truncate">
                                          {image.name}
                                        </p>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() =>
                                            handleImageRemove(
                                              itemId,
                                              currentSupplier,
                                              index
                                            )
                                          }
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Price Calculation */}
                          {/* Price Calculation */}
                          {quotation.unitPrice && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-2">
                                Price Breakdown
                              </h5>
                              <div className="text-blue-800 space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>
                                    Subtotal (₹{quotation.unitPrice} ×{" "}
                                    {item?.editedQty}):
                                  </span>
                                  <span>
                                    ₹
                                    {(
                                      (parseFloat(quotation.unitPrice) || 0) *
                                      (parseFloat(item?.editedQty) || 0)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                {(parseFloat(quotation.discount) || 0) > 0 && (
                                  <div className="flex justify-between text-green-600">
                                    <span>
                                      Discount ({quotation.discount}%):
                                    </span>
                                    <span>
                                      -₹
                                      {console.log(quotation)}
                                      {(
                                        ((parseFloat(quotation.unitPrice) ||
                                          0) *
                                          (parseFloat(item?.editedQty) || 0) *
                                          (parseFloat(quotation.discount) ||
                                            0)) /
                                        100
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>
                                    GST ({quotation.gstPercent || 18}%):
                                  </span>
                                  <span>
                                    ₹
                                    {(
                                      (((parseFloat(quotation.unitPrice) || 0) *
                                        (parseFloat(item?.editedQty) || 0) -
                                        ((parseFloat(quotation.unitPrice) ||
                                          0) *
                                          (parseFloat(item?.editedQty) || 0) *
                                          (parseFloat(quotation.discount) ||
                                            0)) /
                                          100) *
                                        (parseFloat(quotation.gstPercent) ||
                                          18)) /
                                      100
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                {(parseFloat(quotation.freight) || 0) > 0 && (
                                  <div className="flex justify-between">
                                    <span>Freight:</span>
                                    <span>
                                      ₹
                                      {(
                                        parseFloat(quotation.freight) || 0
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                {(parseFloat(quotation.packaging) || 0) > 0 && (
                                  <div className="flex justify-between">
                                    <span>Packaging:</span>
                                    <span>
                                      ₹
                                      {(
                                        parseFloat(quotation.packaging) || 0
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium text-lg border-t pt-2">
                                  <span>Total:</span>
                                  <span>
                                    ₹
                                    {calculateItemTotal(
                                      itemId,
                                      currentSupplier
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Global Terms & Conditions */}
              <div>
                <Label className="text-sm font-medium">
                  General Terms & Conditions
                </Label>
                <Textarea
                  placeholder="Enter general terms and conditions for this supplier..."
                  value={
                    quotations[`general_${currentSupplier}`]?.termsConditions ||
                    ""
                  }
                  onChange={(e) =>
                    setQuotations((prev) => ({
                      ...prev,
                      [`general_${currentSupplier}`]: {
                        ...prev[`general_${currentSupplier}`],
                        termsConditions: e.target.value,
                      },
                    }))
                  }
                  rows={3}
                />
              </div>

              {/* Supplier Summary */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  Supplier Summary
                </h4>
                <div className="text-green-800">
                  <p>
                    Total Items: {getItemsForSupplier(currentSupplier).length}
                  </p>
                  <p className="text-lg font-semibold">
                    {console.log(currentSupplier)}
                    Total Amount: ₹
                    {calculateSupplierTotal(currentSupplier)?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowQuotationDialog(false);
                setCurrentItem(null);
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowQuotationDialog(false);
                setCurrentItem(null);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Quotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={currentImage}
              alt="Preview"
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseTeamSystem;
