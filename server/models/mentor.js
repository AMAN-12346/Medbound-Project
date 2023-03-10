import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import status from "../enums/status";

var mentorModel = new Schema(
  {
    Name: {
      type: String,
    },

    Desgination: {
      type: String,
    },

    Image : {
        type : String,
    },

    Facebook : {
        type: String,
    },
    Instagram : {
        type : String
    },
    LinkedIn : {
        type : String
    },
    Twitter : {
        type : String
    },
    status : {
      type : String,
      default : status.ACTIVE
    }
  },
  { timestamps: true }
);
mentorModel.index({ location: "2dsphere" })
mentorModel.plugin(mongooseAggregatePaginate)
mentorModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("Mentor", mentorModel);