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
  findList: async (query) => {
    return await froummodel.find(query).sort({createdAt : -1});
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

  ClubsrCount: async (query) => {
    return await clubMode.countDocuments(query);
  },
  
  ForumsCount: async (query) => {
    return await froummodel.countDocuments(query);
  },
};

module.exports = { froumServices };
