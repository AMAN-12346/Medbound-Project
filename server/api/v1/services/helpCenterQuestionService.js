import helpCenterQuestionModel from "../../../models/helpCenterQuestionModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const helpCenterQuestionService= {
  create: async (insertObj) => {
    return await helpCenterQuestionModel.create(insertObj);
  },
  find : async (query) => {
    return await helpCenterQuestionModel.findOne(query);
  },
  findList : async (query) => {
    return await helpCenterQuestionModel.find(query);
  },
  findandUpdate : async (query,updateObj) => {
    return await helpCenterQuestionModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { helpCenterQuestionService };