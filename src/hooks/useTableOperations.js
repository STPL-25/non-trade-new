    import { useState } from "react";
import usePost from "@/hooks/usePostHook";
import useUpdate from "@/hooks/useUpdateHook";
import { toast } from "sonner";
import useDelete from "./useDeleteHook";
export const useTableOperations = (master, setTableData, editingItem, itemToDelete, modalHandlers) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { postData } = usePost();
  const { updateData } = useUpdate();
  const { data, loading,  error,  deleteData, reset }=useDelete();

  const {    setShowAddModal,    setShowEditModal,    setShowDeleteModal,    setEditingItem,    setItemToDelete,  } = modalHandlers;

  // Add Save Handler
  const handleAddSave = async (formData) => {
    setIsLoading(true);
    try {
      const response = await postData(
        `${import.meta.env.VITE_API_URL}/api/common_master/${master}`,
        formData
      );
      
      // Add new item to table data
    //   setTableData(prevData => [...prevData, response.data]);
      if(response.status===200){

      }
      toast.success(response?.message || "Item added successfully");
      setShowAddModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error adding entry:", error);
      toast.error("Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Save Handler
  const handleEditSave = async (formData) => {
    if (!editingItem) return;
    
    setIsLoading(true);
    try {
      const response = await updateData(
        `${import.meta.env.VITE_API_URL}/api/${master}`,
        formData
      );

      // Update item in table data
      setTableData(prevData =>
        prevData.map(item =>
          (item.id || item.Sno) === (editingItem.id || editingItem.Sno)
            ? { ...item, ...formData }
            : item
        )
      );

      toast.success(response?.message || "Item updated successfully");
      setShowEditModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error("Failed to update item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    console.log(itemToDelete)
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteData(
        `${import.meta.env.VITE_API_URL}/api/${master}`,itemToDelete
        
      );
      if(response.status==201){
        setTableData(response.data||[])
      }

      // Remove item from table data
    //   setTableData(prevData =>
    //     prevData.filter(item =>
    //       (item.id || item.Sno) !== (itemToDelete.id || itemToDelete.Sno)
    //     )
    //   );

      toast.success(response?.message || "Item deleted successfully");
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isLoading,
    isDeleting,
    handleAddSave,
    handleEditSave,
    handleDeleteConfirm,
  };
};