import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Building2 } from "lucide-react";

const AddedItemsList = ({ items, onEditItem, onDeleteItem }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p>No items added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Added Items ({items.length})
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            index={index}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};

const ItemRow = ({ item, index, onEditItem, onDeleteItem }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">
              Item {index + 1}: {item.description}
            </h4>
            {item.supplier && (
              <Badge variant="secondary" className="text-xs">
                <Building2 className="w-3 h-3 mr-1" />
                {item.supplier.name}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Qty:</span> {item.quantity}
            </div>
            <div className="sm:col-span-1 col-span-2">
              <span className="font-medium">Specs:</span> {item.specifications || "N/A"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditItem(item)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteItem(item.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      </div>
    </div>
  );
};

export default AddedItemsList;
