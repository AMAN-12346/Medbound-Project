import examListModel from "../../../models/examListModel";
import status from '../../../enums/status';
import userType from "../../../enums/userType";
import ExamModel from "../../../models/Exam"

const examModeleService = {
  create: async (insertObj) => {
    return await examListModel.create(insertObj);
  },
  find: async (query) => {
    return await examListModel.findOne(query);
  },
  CheckExamExits: async (query) => {
    return await ExamModel.findOne(query);
  },

  findList: async (query) => {
    return await examListModel.find(query);
  },
  findandUpdate: async (query, updateObj) => {
    return await examListModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

  ExamCount: async (query) => {
    return await examListModel.countDocuments(query);
  },

  CreateExam: async (insertObj) => {
    return await ExamModel.create(insertObj);
  },
  findandUpdateExam: async (query, updateObj) => {
    return await ExamModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

}

module.exports = { examModeleService };