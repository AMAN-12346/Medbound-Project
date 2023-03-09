import AluminiModel from "../../../models/Alumni";

const AluminiServices = {
  createAlumini: async (instaintObj) => {
    return await AluminiModel.create(instaintObj);
  },

  UpdateAlumini: async (query, instaintObj) => {
    return await AluminiModel.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },

  findAlumini: async (query) => {
    return await AluminiModel.findOne(query);
  },
};

module.exports = { AluminiServices };
