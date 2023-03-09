import BannerModel from "../../../models/Banner";

const BannerServices = {
  createBanner: async (instaintObj) => {
    return await BannerModel.create(instaintObj);
  },

  UpdateBAnner: async (query, instaintObj) => {
    return await BannerModel.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },

  findBanner: async (query) => {
    return await BannerModel.findOne(query);
  },
};

module.exports = { BannerServices };
