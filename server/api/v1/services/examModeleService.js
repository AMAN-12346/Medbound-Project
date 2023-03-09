import examListModel from "../../../models/examListModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const examModeleService= {
  create: async (insertObj) => {
    return await examListModel.create(insertObj);
  },
  find : async (query) => {
    return await examListModel.findOne(query);
  },
  findList : async (query) => {
    return await examListModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await examListModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { examModeleService };