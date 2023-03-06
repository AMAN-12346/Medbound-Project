import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';



 var tutoralVideoModel = new Schema({
    
    categoryId: {
      type: String,
      ref : 'tutoralVideoCategoryModel'
    },
    tutorialName : {
        type: String,
    },
    tutorialVideoUrl : {
        type: String,
    },
    description : {
        type: String,
    },
    status : {
        type :String,
        enum : [status.ACTIVE,status.BLOCK,status.DELETE],
        default: status.ACTIVE
    }
  },
  { timestamps: true }
);

tutoralVideoModel.plugin(mongooseAggregatePaginate)
tutoralVideoModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("tutoralVideoModel", tutoralVideoModel);