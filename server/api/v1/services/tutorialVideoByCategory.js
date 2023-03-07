import tutoralVideoModel from "../../../models/tutorialVideoByCatgory";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const tutorialVideoServices = {
  createTutorialVideo: async (insertObj) => {
    return await tutoralVideoModel.create(insertObj);
  },
  findTutorialVideo : async (query) => {
    return await tutoralVideoModel.findOne(query).populate('categoryId');
  },
  findTutorialVideoList : async (query) => {
    return await tutoralVideoModel.find(query).populate('categoryId');
  },
  findandUpdateVideo : async (query,updateObj) => {
    return await tutoralVideoModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { tutorialVideoServices };