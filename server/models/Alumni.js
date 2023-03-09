import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

var AluminiModel = new Schema(
  {
    Name: {
      type: String,
    },

    Description: {
      type: String,
    },

    Image : {
        type : String,
    }
  },
  { timestamps: true }
);
AluminiModel.index({ location: "2dsphere" })
AluminiModel.plugin(mongooseAggregatePaginate)
AluminiModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("Alumini", AluminiModel);