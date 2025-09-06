import DynamicTable from "./DynamicTables";
import { useAppState } from "@/states/hooks/useAppState";
import { useMasterDataFields } from "@/Data/useMasterDataFields";
import useFetch from "@/hooks/useFetchHook";

const MasterScreen = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { selectedMaster, setCurrentScreen } = useAppState();

  // Add error handling for the hook
  const masterDataResult = useMasterDataFields();
  const fields = masterDataResult?.fields || {};


  
  // Safe access to prevent the error
  const headerData = selectedMaster ? (fields[selectedMaster] || []) : [];

  const { data: datas, loading, error } = useFetch(
    selectedMaster ? `${apiUrl}/api/common_master/${selectedMaster}` : null
  );

  // Add loading/error states
  if (!selectedMaster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Please select a master to view</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DynamicTable
        headers={headerData}
        data={datas?.data || []}
        title={selectedMaster?.replace(/([a-z])([A-Z])/g, "$1 $2")}
        master={selectedMaster}
        searchable={true}
        sortable={true}
        className="mb-8"
        setCurrentScreen={setCurrentScreen}
      />
    </div>
  );
};

export default MasterScreen;
