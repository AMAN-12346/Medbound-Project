import medBoundTimesModel from "../../../models/medBoundTimesModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const medBoundTimesService= {
  create: async (insertObj) => {
    return await medBoundTimesModel.create(insertObj);
  },
  find : async (query) => {
    return await medBoundTimesModel.findOne(query);
  },
  findList : async (query) => {
    return await medBoundTimesModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await medBoundTimesModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { medBoundTimesService };