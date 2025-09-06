import { useState,useContext } from "react";
import { useAppState } from "@/states/hooks/useAppState";
export const useTableModals = () => {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {setFormData} = useAppState();
  // Item states
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Add New Handlers
  const handleAddNewClick = () => {
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData(null)
  };

  // Edit Handlers
  const handleEditClick = (id, row) => {
    const itemToEdit = row;
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setShowEditModal(true);
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  // Delete Handlers
  const handleDeleteClick = (id, row) => {
    const item = row;
    if (item) {
      setItemToDelete(item);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return {
    // Modal states
    showAddModal,
    showEditModal,
    showDeleteModal,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,

    // Item states
    editingItem,
    itemToDelete,
    setEditingItem,
    setItemToDelete,

    // Handlers
    handleAddNewClick,
    handleAddModalClose,
    handleEditClick,
    handleEditModalClose,
    handleDeleteClick,
    handleDeleteModalClose,
  };
};