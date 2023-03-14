import Mongoose, { Schema, Types } from "mongoose";
// import mongoosePaginate from "mongoose-paginate";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
import bcrypt from "bcryptjs";

var Event = new Schema(
  {
    title: {
      type: String,
    },

    date: {
      type: String,
    },

    description : {
        type : String,
    },

    invitelink : {
        type: String,
    },
    Image : {
        type : String
    }
  },
  { timestamps: true }
);
module.exports = Mongoose.model("Event", Event);