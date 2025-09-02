import React from "react";
import DataTable from "./DataTable";
import TablePagination from "./TablePagination";

const TableContent = ({  headers,  paginatedData,  processedData,  currentPage,  totalPages,
  sortConfig,  striped,  hoverable,  sortable,  onSort,  onEdit,  onDelete,  onPageChange,
}) => {
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="w-full">
      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto">
        <DataTable
          headers={headers}
          data={paginatedData}
          sortConfig={sortConfig}
          striped={striped}
          hoverable={hoverable}
          sortable={sortable}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalItems={processedData.length}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default TableContent;