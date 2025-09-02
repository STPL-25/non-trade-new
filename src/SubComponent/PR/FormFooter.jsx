// components/PurchaseRequisition/FormFooter.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";

const FormFooter = ({  items, handleSubmit }) => {
  return (
    <div className="sticky bottom-0  bg-white border-t px-4 py-3">
      <div className="flex items-center justify-between">
       
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="h-9 px-4"
          >
            <Save className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Save Draft</span>
            <span className="sm:hidden">Draft</span>
          </Button>
          <Button onClick={() => handleSubmit(false)} className="h-9 px-4">
            <Send className="w-4 h-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormFooter;
