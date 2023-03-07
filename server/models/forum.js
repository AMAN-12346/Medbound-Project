import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
import bcrypt from "bcryptjs";

var forumodel = new Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },

    activities : {
        type : String,
    },

    format : {
        type: String,
    },
    photo : {
        type : String
    }
  },
  { timestamps: true }
);
forumodel.index({ location: "2dsphere" })
forumodel.plugin(mongooseAggregatePaginate)
forumodel.plugin(mongoosePaginate);
module.exports = Mongoose.model("Forum", forumodel);