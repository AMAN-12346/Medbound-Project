import subAdminModel from "../../../models/subAdminModel";
import UserModel from "../../../models/user"
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const subAdminService= {
  createSub_Admin: async (insertObj) => {
    return await UserModel.create(insertObj);
  },
  awaitCkeckUserExits : async (query) => {
    return await UserModel.findOne(query);
  },
  findList : async (query) => {
    return await UserModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await UserModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { subAdminService };