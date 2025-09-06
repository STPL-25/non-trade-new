import { lazy } from "react";


const MasterComponents=lazy(() => import("../MasterDataManagement/MasterDataManagement"));
const PurchaseRequisitionForm = lazy(() => import("../MasterDataManagement/PurchaseRequisitionForm"));
const PurchaseApproval = lazy(() => import("../MasterDataManagement/PurchaseApprovalScreen"));
const PurReqAuthorization = lazy(() => import("../MasterDataManagement/PurchaseRequisitionApproval"));
const HodApproval=lazy(()=>import("../MasterDataManagement/PurchaseReqHeadApproval"))
const BudgetRequest=lazy(()=>import("../MasterDataManagement/BudgetRequestPage"))
const sectionComponents = {
    "PurchaseApproval": PurchaseApproval,
    "PurRequisitionForm": PurchaseRequisitionForm,
    "masters": MasterComponents,
    "PurReqAuthorization" : PurReqAuthorization,
    "HodApproval"  :HodApproval,
    "BudgetRequest": BudgetRequest
};

export { sectionComponents };


