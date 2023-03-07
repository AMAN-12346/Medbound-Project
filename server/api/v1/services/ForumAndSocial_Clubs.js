import froummodel from "../../../models/forum";
import clubMode from "../../../models/club";

const froumServices = {
  createForum: async (instaintObj) => {
    return await froummodel.create(instaintObj);
  },
  UpdateForum: async (query, instaintObj) => {
    return await froummodel.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },

  findForum: async (query) => {
    return await froummodel.findOne(query);
  },
  findClub: async (query) => {
    return await froummodel.findOne(query);
  },
  createClub: async (instaintObj) => {
    return await clubMode.create(instaintObj);
  },

  UpdateClub: async (query, instaintObj) => {
    return await clubMode.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },
};

module.exports = { froumServices };
