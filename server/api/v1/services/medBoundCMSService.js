import medBoundModel from "../../../models/medBoundModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const medBoundCMSService= {
  create: async (insertObj) => {
    return await medBoundModel.create(insertObj);
  },
  find : async (query) => {
    return await medBoundModel.findOne(query);
  },
  findList : async (query) => {
    return await medBoundModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await medBoundModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { medBoundCMSService };