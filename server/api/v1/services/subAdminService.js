import subAdminModel from "../../../models/subAdminModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const subAdminService= {
  create: async (insertObj) => {
    return await subAdminModel.create(insertObj);
  },
  find : async (query) => {
    return await subAdminModel.findOne(query);
  },
  findList : async (query) => {
    return await subAdminModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await subAdminModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { subAdminService };