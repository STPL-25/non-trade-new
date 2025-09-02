import React from "react";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DataTable = ({
  headers,
  data,
  sortConfig,
  striped,
  hoverable,
  sortable,
  onSort,
  onEdit,
  onDelete,
}) => {
  const getSortIcon = (field) => {
    if (sortConfig.key !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-md border max-h-[70vh] overflow-y-auto">
        <Table className="relative">
          <TableHeader className="sticky top-0 bg-background z-10 border-b">
            <TableRow>
              {headers
                .filter((data) => data.view)
                .map((header, index) => (
                  <TableHead
                    key={header.field}
                    className={`${
                      sortable ? "cursor-pointer select-none" : ""
                    } ${
                      index === 0 
                        ? "w-16 min-w-16" 
                        : "min-w-32 max-w-48"
                    } px-2 py-3`}
                    onClick={() => sortable && onSort(header.field)}
                  >
                    <div className="flex items-center">
                      <span className="font-semibold text-xs truncate">
                        {header.label.toUpperCase()}
                      </span>
                      {sortable && getSortIcon(header.field)}
                    </div>
                  </TableHead>
                ))}
              <TableHead className="w-20 min-w-20 px-2 py-3">
                <span className="font-semibold text-xs">ACTIONS</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id || index}
                className={`${hoverable ? "hover:bg-muted/50" : ""} ${
                  striped && index % 2 === 0 ? "bg-muted/25" : ""
                }`}
              >
                {headers
                  .filter((data) => data.view)
                  .map((header) => (
                    <TableCell
                      key={header.field}
                      className={`${
                        header.label === "S.No" ? "font-medium" : ""
                      } px-2 py-3 max-w-48`}
                    >
                      {header.label === "S.No" ? (
                        <Badge 
                          variant="secondary" 
                          className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                      ) : header.render ? (
                        <div className="break-words overflow-hidden">
                          {header.render(row[header.field], row)}
                        </div>
                      ) : (
                        <div
                          className="break-words overflow-hidden text-ellipsis"
                          title={row[header.field]}
                        >
                          {row[header.field]}
                        </div>
                      )}
                    </TableCell>
                  ))}
                <TableCell className="px-2 py-3">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(row.Sno, row)}
                      title="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onDelete(row.Sno, row)}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
