import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Clock, User, Building, Calendar, DollarSign, Package, FileText, Eye } from 'lucide-react';

const PurchaseRequisitionApproval = () => {
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [requisitions, setRequisitions] = useState([
    {
      id: 'PR-2024-001',
      requestor: 'John Smith',
      department: 'IT Department',
      requestDate: '2024-07-28',
      totalAmount: 15750.00,
      priority: 'High',
      status: 'Pending Approval',
      description: 'Computer hardware and software licenses',
      items: [
        { id: 1, description: 'Dell Laptop - Inspiron 15', quantity: 3, unitPrice: 899.99, totalPrice: 2699.97 },
        { id: 2, description: 'Microsoft Office 365 License', quantity: 10, unitPrice: 149.99, totalPrice: 1499.90 },
        { id: 3, description: 'External Monitor 27"', quantity: 3, unitPrice: 299.99, totalPrice: 899.97 },
        { id: 4, description: 'Wireless Mouse and Keyboard Set', quantity: 5, unitPrice: 79.99, totalPrice: 399.95 },
        { id: 5, description: 'Network Switch 24-port', quantity: 1, unitPrice: 450.00, totalPrice: 450.00 },
        { id: 6, description: 'UPS Battery Backup', quantity: 2, unitPrice: 199.99, totalPrice: 399.98 },
        { id: 7, description: 'Cat6 Ethernet Cables (50ft)', quantity: 10, unitPrice: 25.99, totalPrice: 259.90 },
        { id: 8, description: 'Software Development Tools License', quantity: 1, unitPrice: 1200.00, totalPrice: 1200.00 },
        { id: 9, description: 'External Hard Drive 2TB', quantity: 4, unitPrice: 89.99, totalPrice: 359.96 },
        { id: 10, description: 'Webcam HD 1080p', quantity: 8, unitPrice: 49.99, totalPrice: 399.92 }
      ],
      justification: 'Required for new employee onboarding and system upgrades to maintain productivity and security standards.',
      vendor: 'TechSource Solutions',
      deliveryDate: '2024-08-15',
      budgetCode: 'IT-2024-Q3'
    },
    {
      id: 'PR-2024-002',
      requestor: 'Sarah Johnson',
      department: 'Marketing',
      requestDate: '2024-07-29',
      totalAmount: 8500.00,
      priority: 'Medium',
      status: 'Pending Approval',
      description: 'Marketing campaign materials and equipment',
      items: [
        { id: 1, description: 'Professional Camera Equipment', quantity: 1, unitPrice: 2500.00, totalPrice: 2500.00 },
        { id: 2, description: 'Lighting Kit', quantity: 1, unitPrice: 800.00, totalPrice: 800.00 },
        { id: 3, description: 'Marketing Brochures (1000 units)', quantity: 1, unitPrice: 1200.00, totalPrice: 1200.00 },
        { id: 4, description: 'Trade Show Booth Materials', quantity: 1, unitPrice: 3000.00, totalPrice: 3000.00 },
        { id: 5, description: 'Promotional Items', quantity: 500, unitPrice: 2.00, totalPrice: 1000.00 }
      ],
      justification: 'Essential equipment and materials for upcoming product launch campaign and trade show participation.',
      vendor: 'Creative Marketing Pro',
      deliveryDate: '2024-08-10',
      budgetCode: 'MKT-2024-CAMPAIGN'
    }
  ]);

  const handleApprove = (id) => {
    setRequisitions(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
    setSelectedRequisition(null);
    setApprovalComments('');
  };

  const handleReject = (id) => {
    setRequisitions(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
    setSelectedRequisition(null);
    setApprovalComments('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Approval':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Medium Priority</Badge>;
      case 'Low':
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Requisition Approval</h1>
          <p className="text-gray-600">Review and approve pending purchase requisitions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requisitions List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>
                  {requisitions.filter(r => r.status === 'Pending Approval').length} items require your approval
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {requisitions.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedRequisition?.id === req.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedRequisition(req)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{req.id}</h3>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>${req.totalAmount.toLocaleString()}</span>
                        <span>{req.requestDate}</span>
                      </div>
                      <div className="mt-2">
                        {getPriorityBadge(req.priority)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-2">
            {selectedRequisition ? (
              <div className="space-y-6">
                {/* Header Card */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{selectedRequisition.id}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {selectedRequisition.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(selectedRequisition.status)}
                        {getPriorityBadge(selectedRequisition.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Requestor</p>
                          <p className="text-sm text-gray-600">{selectedRequisition.requestor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Department</p>
                          <p className="text-sm text-gray-600">{selectedRequisition.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Request Date</p>
                          <p className="text-sm text-gray-600">{selectedRequisition.requestDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Total Amount</p>
                          <p className="text-lg font-bold text-green-600">
                            ${selectedRequisition.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Vendor</p>
                          <p className="text-sm text-gray-600">{selectedRequisition.vendor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Expected Delivery</p>
                          <p className="text-sm text-gray-600">{selectedRequisition.deliveryDate}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Requested Items</CardTitle>
                    <CardDescription>
                      {selectedRequisition.items.length} items in this requisition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Description</th>
                            <th className="text-right p-2 font-medium">Qty</th>
                            <th className="text-right p-2 font-medium">Unit Price</th>
                            <th className="text-right p-2 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRequisition.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.description}</td>
                              <td className="p-2 text-right">{item.quantity}</td>
                              <td className="p-2 text-right">${item.unitPrice.toFixed(2)}</td>
                              <td className="p-2 text-right font-medium">${item.totalPrice.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-300">
                            <td colSpan="3" className="p-2 font-bold text-right">Total Amount:</td>
                            <td className="p-2 text-right font-bold text-lg text-green-600">
                              ${selectedRequisition.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Justification Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Justification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedRequisition.justification}</p>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">Budget Code:</Label>
                        <p className="text-gray-600">{selectedRequisition.budgetCode}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Preferred Vendor:</Label>
                        <p className="text-gray-600">{selectedRequisition.vendor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Approval Actions */}
                {selectedRequisition.status === 'Pending Approval' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Approval Decision</CardTitle>
                      <CardDescription>
                        Add comments and approve or reject this requisition
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="comments">Approval Comments</Label>
                        <Textarea
                          id="comments"
                          placeholder="Add your comments or feedback..."
                          value={approvalComments}
                          onChange={(e) => setApprovalComments(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Requisition</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve requisition {selectedRequisition.id} for ${selectedRequisition.totalAmount.toLocaleString()}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleApprove(selectedRequisition.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Requisition</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject requisition {selectedRequisition.id}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleReject(selectedRequisition.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Requisition</h3>
                  <p className="text-gray-600">Choose a purchase requisition from the list to view details and make approval decisions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequisitionApproval;