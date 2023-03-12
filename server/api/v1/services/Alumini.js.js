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
  findList: async (query) => {
    return await AluminiModel.find(query);
  },
  
  AlumniCount: async (query) => {
    return await AluminiModel.countDocuments(query);
  },
};

module.exports = { AluminiServices };
