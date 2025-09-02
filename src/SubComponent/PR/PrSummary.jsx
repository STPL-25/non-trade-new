import React from 'react';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';
import { Card ,CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const PrSummary = ({ formData, items, suppliers, priorities, }) => (
  <Card className="mb-3">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-medium flex items-center justify-between">
        Requisition Summary
       
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Basic Info Summary */}
      {(formData.division || formData.branch || formData.requestedBy) && (
        <div>
          <h4 className="font-medium text-gray-700 border-b pb-2 mb-3">Basic Information</h4>
          <div className="space-y-2 text-sm">
            {formData.division && <div><span className="font-medium">Division:</span> {formData.division}</div>}
            {formData.branch && <div><span className="font-medium">Branch:</span> {formData.branch}</div>}
            {formData.department && <div><span className="font-medium">Department:</span> {formData.department}</div>}
            {formData.requestedBy && <div><span className="font-medium">Requested By:</span> {formData.requestedBy}</div>}
            {formData.requiredDate && <div><span className="font-medium">Required Date:</span> {formData.requiredDate}</div>}
            {formData.reason && <div><span className="font-medium">Reason:</span> {formData.reason}</div>}
            {formData.priority && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Priority:</span>
                <Badge className={priorities.find(p => p.value === formData.priority)?.color}>
                  {priorities.find(p => p.value === formData.priority)?.label}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items Summary */}
      {items.some(item => item.description) && (
        <div>
          <h4 className="font-medium text-gray-700 border-b pb-2 mb-3">
            Items ({items.filter(item => item.description).length})
          </h4>
          <div className="space-y-3">
            {items.filter(item => item.description).map(item => (
              <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="font-medium">{item.description}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Quantity: {item.quantity} × ₹{item.unitPrice} = ₹{item.totalPrice.toLocaleString('en-IN')}
                </div>
                {item.specifications && (
                  <div className="text-sm text-gray-500 mt-2">{item.specifications}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suppliers Summary */}
      {suppliers.some(supplier => supplier.name) && (
        <div>
          <h4 className="font-medium text-gray-700 border-b pb-2 mb-3">
            Suppliers ({suppliers.filter(supplier => supplier.name).length})
          </h4>
          <div className="space-y-3">
            {suppliers.filter(supplier => supplier.name).map(supplier => (
              <div key={supplier.id} className="border rounded-lg p-3 bg-blue-50/50">
                <div className="font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {supplier.name}
                </div>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  {supplier.contactPerson && <div>Contact: {supplier.contactPerson}</div>}
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />{supplier.phone}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />{supplier.email}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
    </CardContent>
  </Card>
);

export default PrSummary;
