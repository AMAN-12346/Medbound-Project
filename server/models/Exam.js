import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import status from "../enums/status";

var ExamModule = new Schema(
  {
    name: {
      type: String,
    },

    Link: {
      type: String,
    },
    Exam_Type : {
        type : String,
    },
    status : {
        type : String,
        default : status.ACTIVE
    }
  },
  { timestamps: true }
);
ExamModule.index({ location: "2dsphere" })
ExamModule.plugin(mongooseAggregatePaginate)
ExamModule.plugin(mongoosePaginate);
module.exports = Mongoose.model("Exam", ExamModule);