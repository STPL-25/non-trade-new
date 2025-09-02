import { useState, useEffect, useMemo } from "react";

export const useTableData = (initialData, searchable, sortable) => {
  const [tableData, setTableData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    setTableData(initialData);
  }, [initialData]);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Process data (filter and sort)
  const processedData = useMemo(() => {
    let filtered = tableData;

    // Apply search filter
    if (searchTerm && searchable) {
      filtered = tableData.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key && sortable) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bVal == null) return sortConfig.direction === "asc" ? -1 : 1;
        
        // Compare values
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortConfig, searchable, sortable]);

  // Pagination calculations
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    tableData,
    sortConfig,
    searchTerm,
    currentPage,
    processedData,
    paginatedData,
    totalPages,
    itemsPerPage,
    startIndex,
    setTableData,
    setSortConfig,
    setSearchTerm,
    setCurrentPage,
    handleSort,
  };
};