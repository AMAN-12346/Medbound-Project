import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
import bcrypt from "bcryptjs";

var Gallerymodel = new Schema(
  {
    Name: {
      type: String,
    },
    Image: {
        type: [String],
        default: [0, 0]
      }
  },
  { timestamps: true }
);
Gallerymodel.index({ location: "2dsphere" })
Gallerymodel.plugin(mongooseAggregatePaginate)
Gallerymodel.plugin(mongoosePaginate);
module.exports = Mongoose.model("Galery", Gallerymodel);