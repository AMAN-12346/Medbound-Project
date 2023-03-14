import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

    .post("/SubAdminLogin", controller.SubAdminLogin)

    .use(auth.verifyToken)
    .post("/addSubAdmin", controller.addSubAdmin)
    .post("/viewSubAdmin", controller.viewSubAdmin)
    .get("/subAdminList", controller.subAdminList)
    .put("/editSubAdmin", controller.editSubAdmin)
    .delete("/deleteSubAdmin", controller.deleteSubAdmin)
    .put("/blockUnblockSubAdmin", controller.blockUnblockSubAdmin)


