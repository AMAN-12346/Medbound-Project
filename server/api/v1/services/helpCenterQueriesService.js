import helpCenterQueriesModel from "../../../models/helpCenterQueriesModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const helpCenterQueryService= {
  create: async (insertObj) => {
    return await helpCenterQueriesModel.create(insertObj);
  },
  find : async (query) => {
    return await helpCenterQueriesModel.findOne(query);
  },
  findList : async (query) => {
    return await helpCenterQueriesModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await helpCenterQueriesModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { helpCenterQueryService };