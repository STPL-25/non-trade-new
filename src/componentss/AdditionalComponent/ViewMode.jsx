
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

function ViewMode({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-1 bg-background/70 backdrop-blur-sm border border-border rounded-xl p-1 ml-1">
      <Button
        onClick={() => setViewMode("grid")}
        variant={viewMode === "grid" ? "default" : "primary"}
        size="sm"
        className={`p-2 h-auto rounded-lg transition-all ${
          viewMode === "grid"
            ? "shadow-md"
            : "hover:bg-muted"
        }`}
      >
        <Grid className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => setViewMode("list")}
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        className={`p-2 h-auto rounded-lg transition-all ${
          viewMode === "list"
            ? "shadow-md"
            : "hover:bg-muted"
        }`}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default ViewMode;