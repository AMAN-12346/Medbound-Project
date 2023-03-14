
import faqModel from "../../../models/faq";
import faqCategoryModel from "../../../models/faqCategoryModel";
import status from "../../../enums/status";


const faqServices = {

    createFAQ: async (insertObj) => {
        return await faqModel.create(insertObj);
    },
    createFAQCategory: async (insertObj) => {
        return await faqCategoryModel.create(insertObj);
    },

    findFAQ: async (query) => {
        return await faqModel.findOne(query).populate('categoryId');
    },
    findFAQCategory: async (query) => {
        return await faqCategoryModel.findOne(query);
    },

    updateFAQ: async (query, updateObj) => {
        return await faqModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    updateFAQCategory: async (query, updateObj) => {
        return await faqCategoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    FAQList: async () => {
        return await faqModel.find({});
    },
    FAQListCategory: async (query) => {
        return await faqCategoryModel.find(query);
    },
    faqListWithPagination: async (validatedBody) => {
        let query = {  status: { $ne: status.DELETE } };
        const {  page, limit } = validatedBody;
        let options = {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          sort: { createdAt: -1 },
          populate: { path: 'categoryId', model: 'faqCategoryModel' }
        };
        return await faqModel.paginate(query, options);
      },

}

module.exports = { faqServices };
