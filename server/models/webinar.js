import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

var WebinarModel = new Schema(
  {
    Title: {
      type: String,
    },

    Date_Time: {
      type: String,
    },

    Program : {
        type : String,
    },

    Topic : {
        type: String,
    },
    Invite_Link : {
        type : String
    },
    Description : {
        type : String
    },
    Speaker_Image : {
        type : String
    },
    Webinar_Image : {
        type : String
    },
  },
  { timestamps: true }
);
WebinarModel.index({ location: "2dsphere" })
WebinarModel.plugin(mongooseAggregatePaginate)
WebinarModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("WEBINAR", WebinarModel);