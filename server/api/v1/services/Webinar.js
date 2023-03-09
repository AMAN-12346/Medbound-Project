import WebinarModel from "../../../models/webinar";

const WebinarServices = {
  createWebinar: async (instaintObj) => {
    return await WebinarModel.create(instaintObj);
  },

  UpdateWebinar: async (query, instaintObj) => {
    return await WebinarModel.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },

  findWebibar: async (query) => {
    return await WebinarModel.findOne(query);
  },
  findList: async (query) => {
    return await WebinarModel.find(query);
  },
};

module.exports = { WebinarServices };
