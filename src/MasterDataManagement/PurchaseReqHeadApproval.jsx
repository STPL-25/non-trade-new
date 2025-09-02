import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "@/components/ui/dialog";
import {  CheckCircle,  XCircle,  Clock,  User,  Calendar,  DollarSign,  Search,  Building2,  Package,  FileText,  AlertTriangle,  ChevronRight,  Check,  X,  QrCode,} from "lucide-react";
import useFetch from "@/hooks/useFetchHook";
import useUpdate from "@/hooks/useUpdateHook";
import { useBasicInfoFields } from "@/Data/PRData";



const PurchaseApprovalSystem = () => {
  const [selectedReq, setSelectedReq] = useState(null);
  const [comments, setComments] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const {  updateData}=useUpdate()
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, loading, error } = useFetch(`${apiUrl}/api/pr/getbasic`);
  const { data: prItemsData, loading: prItemsLoading, error: prItemsError, } = useFetch(`${apiUrl}/api/pr/getiemsinfo`, selectedReq);

  const basicInfoFields = useBasicInfoFields();


  // Helper function to get label from field configuration
  const getFieldLabel = (fieldName) => {
    const field = basicInfoFields.find((f) => f.name === fieldName);
    return field ? field.label : fieldName;
  };

  // Helper function to get display value for select fields
  const getDisplayValue = (fieldName, value) => {
    const field = basicInfoFields.find((f) => f.name === fieldName);
    if (field && field.type === "select" && field.options) {
      const option = field.options.find((opt) => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  // Transform API data to match component structure
  const transformedData = data
    ? data.data.map((item) => ({
        ...item,
        id: item.PR_QRCODE,
        dateRequested: item.REQ_DATE,
        requestDate: item.RQ_DATE,
        department: item.DEPT,
        ecno: item.ECNO,
        priority: item.PRIORITY,
        reason: item.REASON,
        status:
          item.STATUS?.trim() === "P"
            ? "Pending"
            : item.STATUS?.trim() === "A"
            ? "Approved"
            : item.STATUS?.trim() === "R"
            ? "Rejected"
            : "Pending",
        // Calculate days waiting
        daysWaiting: Math.floor(
          (new Date() - new Date(item.RQ_DATE)) / (1000 * 60 * 60 * 24)
        ),
      }))
    : [];

  const handleAction = (action, query) => {
    setPendingAction({action,query});
    setShowConfirmDialog(true);
  };

  const confirmAction = async() => {
    console.log(pendingAction,comments)
    if ( !pendingAction?.action) return;
   try {
    const result = await updateData(`${apiUrl}/api/pr/updateiemsinfo`,pendingAction?.query,{COMMENT:comments,ACTION:pendingAction?.action})
    if (result.status===200){
      setComments('')
    }
   } catch (error) {
    setComments('')
    
   }

    setComments("");
    setShowConfirmDialog(false);
    setPendingAction(null);
    setSelectedReq(null);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[priority?.toLowerCase()] || colors["medium"];
  };

  const getStatusColor = (status) => {
    const colors = {
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Rejected: "bg-red-50 text-red-700 border-red-200",
      Pending: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return colors[status] || colors["Pending"];
  };

  const getStatusIcon = (status) => {
    const icons = {
      Approved: <CheckCircle className="h-4 w-4" />,
      Rejected: <XCircle className="h-4 w-4" />,
      Pending: <Clock className="h-4 w-4" />,
    };
    return icons[status] || icons["Pending"];
  };

  const filteredReqs = transformedData.filter(
    (req) =>
      req.PR_QRCODE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.DEPT?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.ECNO?.toString().includes(searchTerm.toLowerCase())
  );

  const pendingCount = transformedData.filter(
    (r) => r.status === "Pending"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase requisitions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
     

      <div className="max-w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search by QR Code, Department, or ECNO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Requisition List */}
            <div className="space-y-3 max-h-[calc(90vh-300px)] overflow-y-auto">
              {filteredReqs.length > 0 ? (
                filteredReqs.map((req) => (
                  <Card
                    key={req.PR_SNO}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedReq === req.PR_QRCODE
                        ? "ring-2 ring-blue-500 shadow-md"
                        : "hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedReq(req.PR_QRCODE)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            req.PRIORITY
                          )}`}
                        >
                          {getDisplayValue("PRIORITY", req.PRIORITY)}
                        </Badge>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                            req.status
                          )}`}
                        >
                          {getStatusIcon(req.status)}
                          {req.status}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4 text-gray-400" />
                          <div className="font-semibold text-gray-900 text-sm">
                            {req.PR_QRCODE}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3" />
                            <span>{getDisplayValue("DEPT", req.DEPT)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>
                              {getFieldLabel("ECNO")}: {req.ECNO}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(req.REQ_DATE).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          <span className="font-medium">
                            {getFieldLabel("REASON")}:
                          </span>{" "}
                          {getDisplayValue("REASON", req.REASON)}
                        </div>

                        {req.status === "Pending" && req.daysWaiting > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle className="h-3 w-3" />
                            Waiting {req.daysWaiting} days
                          </div>
                        )}
                      </div>

                      {selectedReq === req.PR_QRCODE && (
                        <ChevronRight className="h-4 w-4 text-blue-500 ml-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No requisitions found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedReq ? (
              <div className="space-y-6">
                {/* Header Card */}

                {/* PR Items Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Purchase Requisition Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {prItemsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">
                          Loading items...
                        </span>
                      </div>
                    ) : prItemsError ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600">
                          Error loading items: {prItemsError}
                        </p>
                      </div>
                    ) : prItemsData &&
                      prItemsData.data &&
                      prItemsData.data.length > 0 ? (
                      <div className="space-y-4">
                        {prItemsData.data.map((item, index) => (
                          <div
                            key={item.PR_SNO}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Product
                                  </label>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.PR_PRODUCT}
                                  </p>
                                </div>
                                {item.PR_CODE && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                      Product Code
                                    </label>
                                    <p className="text-sm text-gray-700">
                                      {item.PR_CODE}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Quantity
                                  </label>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.PR_QTY}
                                    {item.UOM_SNO === 0
                                      ? " " + "Not specified"
                                      : " " + ` ${item.UOM_SNO}`}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {item.SUGG_SUP && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                      Suggested Supplier
                                    </label>
                                    <p className="text-sm text-gray-700">
                                      {item.SUGG_SUP}
                                    </p>
                                  </div>
                                )}

                                {item.SPECS && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                      Specifications
                                    </label>
                                    <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-md">
                                      {item.SPECS}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No items found for this requisition
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Approval Actions */}
                {(() => {
                  const reqData = transformedData.find(
                    (req) => req.PR_QRCODE === selectedReq
                  );
                  return reqData?.status === "Pending" ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Approval Decision
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Comments (Optional)
                          </label>
                          <Textarea
                            placeholder="Add your comments about this approval decision..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleAction("approve", selectedReq)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleAction("reject", selectedReq)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      className={
                        reqData?.status === "Approved"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`p-2 rounded-full ${
                              reqData?.status === "Approved"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {getStatusIcon(reqData?.status)}
                          </div>
                          <div>
                            <div className="font-bold text-lg">
                              Requisition {reqData?.status}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Select a Requisition
                  </h3>
                  <p className="text-gray-500">
                    Choose a purchase requisition from the list to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingAction?.action === "approve" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Confirm {pendingAction?.action === "approve" ? "Approval" : "Rejection"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingAction?.action} requisition{" "}
              {selectedReq?.PR_QRCODE}?
            </DialogDescription>
          </DialogHeader>

          {comments && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Your Comments:</span> {comments}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                pendingAction?.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              Confirm {pendingAction?.action === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseApprovalSystem;
