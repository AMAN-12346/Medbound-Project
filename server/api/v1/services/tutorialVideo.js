import tutoralVideoCategoryModel from "../../../models/tutorialVideoModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const tutorialServices = {
  createTutorialCategory: async (insertObj) => {
    return await tutoralVideoCategoryModel.create(insertObj);
  },
  findTutorialCategory : async (query) => {
    return await tutoralVideoCategoryModel.findOne(query);
  },
  findTutorialCategoryList : async (query) => {
    return await tutoralVideoCategoryModel.find(query);
  },
  findandUpdateCategory : async (query,updateObj) => {
    return await tutoralVideoCategoryModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

  TutorialsCount: async (query) => {
    return await tutoralVideoCategoryModel.countDocuments(query);
  },

}

module.exports = { tutorialServices };