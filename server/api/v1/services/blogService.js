import blogModel from "../../../models/blogModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const blogServices = {
  createBlog: async (insertObj) => {
    return await blogModel.create(insertObj);
  },
  findBlog : async (query) => {
    return await blogModel.findOne(query);
  },
  findBlogList : async (query) => {
    return await blogModel.find(query);
  },
  findandUpdateBlog : async (query,updateObj) => {
    return await blogModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { blogServices };