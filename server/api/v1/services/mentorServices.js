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
};

module.exports = { mentorServices };
