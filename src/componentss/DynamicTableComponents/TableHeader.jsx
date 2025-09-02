import React from "react";
import { Search, Download, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TableHeader = ({
  title,
  searchable,
  searchTerm,
  onSearchChange,
  exportEnabled,
  settingsEnabled,
  onAddNew,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        {title}
      </h3>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        {searchable && (
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search records..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {exportEnabled && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          {settingsEnabled && (
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          )}
          <Button onClick={onAddNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
