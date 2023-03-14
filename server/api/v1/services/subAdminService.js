import subAdminModel from "../../../models/subAdminModel";
import UserModel from "../../../models/user"
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const subAdminService = {

  SubAdminList: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE }, userType : userType.SUB_ADMIN};
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 }
    };
    return await UserModel.paginate(query, options);
  },

  
  createSub_Admin: async (insertObj) => {
    return await UserModel.create(insertObj);
  },
  awaitCkeckUserExits: async (query) => {
    return await UserModel.findOne(query);
  },
  findList: async (query) => {
    return await UserModel.find(query);
  },
  findandUpdate: async (query, updateObj) => {
    return await UserModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { subAdminService };