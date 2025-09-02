import { lazy } from "react";
import { MasterDataProvider } from "@/MasterDataManagement/MasterDatacontext/MasterDataContext";
const withContextProvider = (Component) => {
    return (props) => (
        <MasterDataProvider>
            <Component {...props} />
        </MasterDataProvider>
    );
};

const MasterComponents=lazy(() => import("../MasterDataManagement/MasterDataManagement"));
const PurchaseRequisitionForm = lazy(() => import("../MasterDataManagement/PurchaseRequisitionForm"));
const PurchaseApproval = lazy(() => import("../MasterDataManagement/PurchaseApprovalScreen"));
const PurReqAuthorization = lazy(() => import("../MasterDataManagement/PurchaseRequisitionApproval"));
const HodApproval=lazy(()=>import("../MasterDataManagement/PurchaseReqHeadApproval"))

const sectionComponents = {
    "PurchaseApproval": PurchaseApproval,
    "PurRequisitionForm": PurchaseRequisitionForm,
    "masters": withContextProvider(MasterComponents),
    "PurReqAuthorization" : PurReqAuthorization,
    "HodApproval"  :HodApproval,
};

export { sectionComponents };


