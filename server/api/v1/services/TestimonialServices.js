import TestimonialModel from "../../../models/Testimonal";


const TestimonialServices = {

    createTestimonial: async (insertObj) => {
        return await TestimonialModel.create(insertObj);
    },

    findTestimonial: async (query) => {
        return await TestimonialModel.findOne(query);
    },

    updateTestimonial: async (query, updateObj) => {
        return await TestimonialModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    staticTestimonialList: async (query) => {
        return await TestimonialModel.find(query);
    },

}

module.exports = { TestimonialServices };
