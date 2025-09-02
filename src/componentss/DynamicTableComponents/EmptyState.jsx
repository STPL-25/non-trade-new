import React from "react";
import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = ({ searchTerm, onClearSearch, onAddNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center min-h-96">
      <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <Filter className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No results found
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {searchTerm
          ? `We couldn't find any records matching "${searchTerm}". Try adjusting your search terms.`
          : "There are no records to display. Create your first entry to get started."}
      </p>
      
      <div className="flex gap-3">
        {searchTerm && (
          <Button
            variant="outline"
            onClick={onClearSearch}
          >
            <Search className="w-4 h-4 mr-2" />
            Clear Search
          </Button>
        )}
        <Button
          onClick={onAddNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Entry
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
