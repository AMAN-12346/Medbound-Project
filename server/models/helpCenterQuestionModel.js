import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var helpCenterQuestionModel = new Schema({
    
    question: {
      type: String
    },
    answer: {
      type: String
    },
    status : {
        type :String,
        enum : [status.ACTIVE,status.BLOCK,status.DELETE],
        default: status.ACTIVE
    }
  },
  { timestamps: true }
);

helpCenterQuestionModel.plugin(mongooseAggregatePaginate)
helpCenterQuestionModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("helpCenterQuestionModel", helpCenterQuestionModel);
