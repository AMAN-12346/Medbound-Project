import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var helpCenterQueriesModel = new Schema({
    
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    description: {
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

helpCenterQueriesModel.plugin(mongooseAggregatePaginate)
helpCenterQueriesModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("helpCenterQueriesModel", helpCenterQueriesModel);
