import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ItemGridCard({ viewMode, handleItemClick, filteredItems }) {
  return (
    <div
      className={`${
        viewMode === "grid"
          ? "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-10 gap-4"
          : "flex flex-col gap-3"
      }`}
    >
      {filteredItems.map((item, index) => (
        <Card
          key={index}
          onClick={() => handleItemClick(item)}
          className={`group relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden border-muted ${
            viewMode === "list"
              ? "flex items-center"
              : "aspect-square"
          }`}
        >
          <CardContent
            className={`${
              viewMode === "grid"
                ? "flex flex-col items-center justify-center h-full p-4"
                : "flex items-center justify-between w-full p-4"
            }`}
          >
            {viewMode === "grid" ? (
              <>
                {/* Icon container */}
                <div
                  className={`${item.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm`}
                >
                  <div className="text-white">{item.icon}</div>
                </div>

                {/* Item name */}
                <span className="text-foreground font-medium text-center text-sm group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className={`${item.color} p-3 rounded-xl shadow-sm`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground font-medium">
                      {item.name}
                    </span>
                    <Badge variant="secondary" className="w-fit text-xs capitalize">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ItemGridCard;