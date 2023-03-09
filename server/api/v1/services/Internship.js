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

  Updateinternship : async(query, instaintObj) => {
    return await Internship.findByIdAndUpdate(query, instaintObj, {new : true});
},


  
}

module.exports = { Internshipservive };