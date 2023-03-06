import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var flashCardSubCategoryModel = new Schema({
    categoryId: {
        type: String,
        ref : 'flashCardCategoryModel'
      },
    subCategoryName: {
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

flashCardSubCategoryModel.plugin(mongooseAggregatePaginate)
flashCardSubCategoryModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("flashCardSubCategoryModel", flashCardSubCategoryModel);
