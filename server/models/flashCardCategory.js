import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var flashCardCategoryModel = new Schema({
    
    categoryName: {
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

flashCardCategoryModel.plugin(mongooseAggregatePaginate)
flashCardCategoryModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("flashCardCategoryModel", flashCardCategoryModel);
