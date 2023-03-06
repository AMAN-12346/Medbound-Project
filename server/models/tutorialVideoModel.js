import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var tutoralVideoCategoryModel = new Schema({
    
    categoryName: {
      type: String
    },
    status : {
        type :String,
        enum : status,
        default: status.ACTIVE
    }
  },
  { timestamps: true }
);

tutoralVideoCategoryModel.plugin(mongooseAggregatePaginate)
tutoralVideoCategoryModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("user", tutoralVideoCategoryModel);


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
        enum : status,
        default: status.ACTIVE
    }
  },
  { timestamps: true }
);

tutoralVideoModel.plugin(mongooseAggregatePaginate)
tutoralVideoModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("user", tutoralVideoModel);