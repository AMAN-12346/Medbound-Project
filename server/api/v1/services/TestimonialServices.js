import TestimonialModel from "../../../models/Testimonal";
import StoryModel from "../../../models/Story";


const TestimonialServices = {

    createTestimonial: async (insertObj) => {
        return await TestimonialModel.create(insertObj);
    },

    createStory: async (insertObj) => {
        return await StoryModel.create(insertObj);
    },

    findTestimonial: async (query) => {
        return await TestimonialModel.findOne(query);
    },


    findStory: async (query) => {
        return await StoryModel.findOne(query);
    },
    updateTestimonial: async (query, updateObj) => {
        return await TestimonialModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    updateStory: async (query, updateObj) => {
        return await StoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    staticTestimonialList: async (query) => {
        return await TestimonialModel.find(query);
    },

}

module.exports = { TestimonialServices };
