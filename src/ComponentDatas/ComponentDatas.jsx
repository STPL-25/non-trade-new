import { lazy } from "react";


const MasterComponents=lazy(() => import("../MasterDataManagement/MasterDataManagement"));
const PurchaseRequisitionForm = lazy(() => import("../MasterDataManagement/PurchaseRequisitionForm"));
const PurchaseApproval = lazy(() => import("../MasterDataManagement/PurchaseApprovalScreen"));
const PurReqAuthorization = lazy(() => import("../MasterDataManagement/PurchaseRequisitionApproval"));
const HodApproval=lazy(()=>import("../MasterDataManagement/PurchaseReqHeadApproval"))

const sectionComponents = {
    "PurchaseApproval": PurchaseApproval,
    "PurRequisitionForm": PurchaseRequisitionForm,
    "masters": MasterComponents,
    "PurReqAuthorization" : PurReqAuthorization,
    "HodApproval"  :HodApproval,
};

export { sectionComponents };


