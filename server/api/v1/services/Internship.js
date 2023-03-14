import userModel from "../../../models/user";
import status from '../../../enums/status';
import userType from "../../../enums/userType";
import Internship from "../../../models/Internship"


const Internshipservive = {
  createinternship: async (insertObj) => {
    return await Internship.create(insertObj);
  },

  findUser: async (query) => {
    return await userModel.findOne(query);
  },

  checkUserExists: async (name) => {
    let query = { $and: [{ status: { $ne: status.DELETE } }, { $or: [{ name: name }] }] }
    return await Internship.findOne(query);
  },
  findinternship: async (query) => {
    return await Internship.findOne(query);
  },
  findList: async (query) => {
    return await Internship.find(query).sort({createdAt:-1});
  },

  Updateinternship: async (query, instaintObj) => {
    return await Internship.findByIdAndUpdate(query, instaintObj, { new: true });
  },

  IntershipsCount: async (query) => {
    return await Internship.countDocuments(query);
  },


  IntershipsCount: async (query) => {
    return await Internship.countDocuments(query);
  },

}

module.exports = { Internshipservive };