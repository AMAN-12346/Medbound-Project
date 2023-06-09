import mentorModel from "../../../models/mentor";

const mentorServices = {
  createMentor: async (instaintObj) => {
    return await mentorModel.create(instaintObj);
  },

  UpdateMentor: async (query, instaintObj) => {
    return await mentorModel.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },

  findMentor: async (query) => {
    return await mentorModel.findOne(query);
  },
  findList: async (query) => {
    return await mentorModel.find(query);
  },

  MentorsCount: async (query) => {
    return await mentorModel.countDocuments(query);
  },
};

module.exports = { mentorServices };
