import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

var BannerModel = new Schema(
  {
    Name: {
        type: String,
      },
      Image : {
          type : String,
      }
  },
  { timestamps: true }
);
BannerModel.index({ location: "2dsphere" })
BannerModel.plugin(mongooseAggregatePaginate)
BannerModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("Banner", BannerModel);