import userModel from "../../../models/user";
import status from "../../../enums/status";
import userType from "../../../enums/userType";
import EventModel from "../../../models/Event";

const eventservice = {
  // createevent: async (insertObj) => {
  //   return await Event.create(insertObj);
  // },
  createWebinar: async (instaintObj) => {
    return await EventModel.create(instaintObj);
  },

  findevent: async (query) => {
    return await EventModel.findOne(query);
  },
  findUser1: async (query) => {
    return await EventModel.findOne(query);
  },
  checkUserExists: async (name) => {
    let query = {
      $and: [{ status: { $ne: status.DELETE } }, { $or: [{ name: name }] }],
    };
    return await EventModel.findOne(query);
  },

  UpdatEevent: async (query, instaintObj) => {
    return await EventModel.findByIdAndUpdate(query, instaintObj, { new: true });
  },

  //   findUsermed: async (query) => {
  //     return await Medboundlist.findOne(query);
  //   },
  //   findCount: async (query) => {
  //     return await userModel.count(query);
  //   },

  //   updateUser: async (query, updateObj) => {
  //     return await userModel.findOneAndUpdate(query, updateObj, { new: true });
  //   },

  //   updateUserById: async (query, updateObj) => {
  //     return await userModel.findByIdAndUpdate(query, updateObj, { new: true });
  //   },

  //   insertManyUser: async (obj) => {
  //     return await userModel.insertMany(obj);
  //   },
  //   createAddress: async (validatedBody) => {
  //     return await userModel(validatedBody).save()
  //   },
  //   editEmailMobileExist: async (email, mobileNumber, userId) => {
  //     let query = { $and: [{ status: { $ne: status.DELETE } }, { _id: { $ne: userId } }, { $or: [{ email: email }, { mobileNumber: mobileNumber }] }] }
  //     return await userModel.findOne(query);
  //   },
};

module.exports = { eventservice };
