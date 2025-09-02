import DynamicTable from "./DynamicTables";
import { ParentContext } from "../../ParentContext/ParentContext";
import { MasterDataContext } from "@/MasterDataManagement/MasterDatacontext/MasterDataContext";
import { useContext } from "react";

import useFetch from "@/hooks/useFetchHook";
const MasterScreen = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {selectedMaster,setCurrentScreen,fields} = useContext(MasterDataContext);

  
  console.log("fields", selectedMaster);
  const headerData = fields[selectedMaster] || [];
  const {data: datas,loading: loading, error: error, } = useFetch(`${apiUrl}/api/common_master/${selectedMaster}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DynamicTable
        headers={headerData || []}
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
