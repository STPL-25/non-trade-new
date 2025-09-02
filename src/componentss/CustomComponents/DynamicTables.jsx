
import React, { useState, useEffect ,useContext} from "react";
import { ArrowLeft } from "lucide-react";
import TableHeader from "../DynamicTableComponents/TableHeader";
import TableContent from "../DynamicTableComponents/TableContent";
import TableModals from "../DynamicTableComponents/TableModals";
import EmptyState from "../DynamicTableComponents/EmptyState";
import { useTableData } from "@/hooks/useTableData";
import { useTableModals } from "@/hooks/useTableModals";
import { useTableOperations } from "@/hooks/useTableOperations";
import { Button } from "../AdditionalComponent/AdditionalComponent";

const DynamicTable = ({  headers = [],  data = [],  title = "Dynamic Table",  searchable = true,
  sortable = true,  striped = true,  hoverable = true,  className = "",  exportEnabled = false,
  settingsEnabled = false,  onAddNew = null,  master,  setCurrentScreen,}) => {

  const { tableData, sortConfig, searchTerm,  currentPage, processedData,
    paginatedData,    totalPages,    setSortConfig,    setSearchTerm,    setCurrentPage,    setTableData,    handleSort,  } = useTableData(data, searchable, sortable);

  const {    showAddModal,    showEditModal,    showDeleteModal,    editingItem,
    itemToDelete,    handleAddNewClick,    handleAddModalClose,    handleEditClick,
    handleEditModalClose,    handleDeleteClick,    handleDeleteModalClose,    setEditingItem,
    setItemToDelete,    setShowAddModal,    setShowEditModal,    setShowDeleteModal,  } = useTableModals();

  const {    isLoading,    isDeleting,    handleAddSave,    handleEditSave,    handleDeleteConfirm,  } = useTableOperations(master, setTableData, editingItem, itemToDelete, 
    {    setShowAddModal,    setShowEditModal,    setShowDeleteModal,    setEditingItem,    setItemToDelete,  });

  // Show empty state if no data
  if (paginatedData.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
          <Button
              onClick={() => setCurrentScreen("main")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit mb-4 p-2 rounded-md hover:bg-gray-100"
              title="Back to Main Screen"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Main</span>
            </Button>

        <EmptyState
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
          onAddNew={handleAddNewClick}
        />
        <TableModals
          showAddModal={showAddModal}
          showEditModal={showEditModal}
          showDeleteModal={showDeleteModal}
          headers={headers}
          editingItem={editingItem}
          itemToDelete={itemToDelete}
          isLoading={isLoading}
          isDeleting={isDeleting}
          master={master}
          onAddModalClose={handleAddModalClose}
          onEditModalClose={handleEditModalClose}
          onDeleteModalClose={handleDeleteModalClose}
          onAddSave={handleAddSave}
          onEditSave={handleEditSave}
          onDeleteConfirm={handleDeleteConfirm}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="mx-auto mt-2 space-y-6">
        {/* Back Button */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <Button
              onClick={() => setCurrentScreen("main")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit mb-4 p-2 rounded-md hover:bg-gray-100"
              title="Back to Main Screen"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Main</span>
            </Button>

            {/* Table Header */}
            <TableHeader
              title={title}
              searchable={searchable}
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              exportEnabled={exportEnabled}
              settingsEnabled={settingsEnabled}
              onAddNew={handleAddNewClick}
            />
          </div>

          {/* Table Content with proper overflow handling */}
          <div className="overflow-hidden">
            <TableContent
              headers={headers}
              paginatedData={paginatedData}
              processedData={processedData}
              currentPage={currentPage}
              totalPages={totalPages}
              sortConfig={sortConfig}
              striped={striped}
              hoverable={hoverable}
              sortable={sortable}
              onSort={handleSort}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <TableModals
        showAddModal={showAddModal}
        showEditModal={showEditModal}
        showDeleteModal={showDeleteModal}
        headers={headers}
        editingItem={editingItem}
        itemToDelete={itemToDelete}
        isLoading={isLoading}
        isDeleting={isDeleting}
        master={master}
        onAddModalClose={handleAddModalClose}
        onEditModalClose={handleEditModalClose}
        onDeleteModalClose={handleDeleteModalClose}
        onAddSave={handleAddSave}
        onEditSave={handleEditSave}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DynamicTable;