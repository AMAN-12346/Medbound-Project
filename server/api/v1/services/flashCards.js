import flashCardCategory from "../../../models/flashCardCategory";
import flashCardSubCategory from "../../../models/flashCardSubCategory";
import flashCardModel from "../../../models/flashCard";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const flashCardsServices = {
  createFlashCardCategory: async (insertObj) => {
    return await flashCardCategory.create(insertObj);
  },
  findFlashCardCategory : async (query) => {
    return await flashCardCategory.findOne(query);
  },
  findFlashCardCategoryList : async (query) => {
    return await flashCardCategory.find(query);
  },
  findandUpdateFlashCardCategory : async (query,updateObj) => {
    return await flashCardCategory.findByIdAndUpdate(query, updateObj, { new: true });
  },


  createFlashCardSubCategory: async (insertObj) => {
    return await flashCardSubCategory.create(insertObj);
  },
  findFlashCardSubCategory : async (query) => {
    return await flashCardSubCategory.findOne(query).populate('categoryId');
  },
  findFlashCardSubCategoryList : async (query) => {
    return await flashCardSubCategory.find(query).populate('categoryId');
  },
  findandUpdateFlashCardSubCategory : async (query,updateObj) => {
    return await flashCardSubCategory.findByIdAndUpdate(query, updateObj, { new: true });
  },

  createFlashCard: async (insertObj) => {
    return await flashCardModel.create(insertObj);
  },
  findFlashCard : async (query) => {
    return await flashCardModel.findOne(query).populate('categoryId').populate('subCategoryId');
  },
  findFlashCardList : async (query) => {
    return await flashCardModel.find(query).populate('categoryId').populate('subCategoryId');
  },
  findandUpdateFlashCard : async (query,updateObj) => {
    return await flashCardModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { flashCardsServices };