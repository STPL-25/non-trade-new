// components/PurchaseRequisition/FormHeader.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Minimize2, Maximize2, Eye, EyeOff } from "lucide-react";

const FormHeader = ({ 
  isFullscreen, 
  setIsFullscreen, 
  showSummary, 
  setShowSummary, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  tabs,
  activeTab,
  setActiveTab 
}) => {
  return (
    <div className=" px-4 py-3">
    
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                setMobileMenuOpen(false);
              }}
              className="h-8 px-3"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSummary(!showSummary);
                setMobileMenuOpen(false);
              }}
              className="h-8 px-3"
            >
              {showSummary ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              Summary
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Tab Navigation */}
      <div className="md:hidden mt-3">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
