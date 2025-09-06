import React from "react";
import AddNewModal from "../CustomComponents/AddNewModel";
import EditModal from "../CustomComponents/EditModel";
import DeleteConfirmationModal from "../CustomComponents/DeleteConfirmationModal";
const TableModals = ({  showAddModal,  showEditModal,  showDeleteModal,  headers,  editingItem,  itemToDelete,  isLoading,
  isDeleting,  master,  onAddModalClose,  onEditModalClose,  onDeleteModalClose,  onAddSave,  onEditSave,  onDeleteConfirm, }) => {
  return (
    <>
      {/* Add New Modal */}
      <AddNewModal
        isOpen={showAddModal}
        onClose={onAddModalClose}
        headers={headers.filter((header) => header.input)}
        onSave={onAddSave}
        isLoading={isLoading}
        master={master}
      />

      {/* Edit Modal */}
      {/* <EditModal
        isOpen={showEditModal}
        onClose={onEditModalClose}
        headers={headers.filter((header) => header.input)}
        onSave={onEditSave}
        isLoading={isLoading}
        initialData={editingItem}
        master={master}
      /> */}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        onConfirm={onDeleteConfirm}
        itemName={
          itemToDelete?.name ||
          itemToDelete?.title
        
        }
        isLoading={isDeleting}
      />
    </>
  );
};

export default TableModals;