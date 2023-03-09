import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var examListModel = new Schema({

    about : {
        updatedAt : {
            type : Date
        }
    },
    list_Of_Available_Exams : {
        updatedAt : {
            type : Date
        }
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default: status.ACTIVE
    }
},
    { timestamps: true }
);
examListModel.index({ location: "2dsphere" })
examListModel.plugin(mongooseAggregatePaginate)
examListModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("examListModel", examListModel);



Mongoose.model("examListModel", examListModel).find({}, async (err, result) => {
    if (err) {
      console.log("DEFAULT medBound ERROR", err);
    }
    else if (result.length != 0) {
      console.log("Default medBound 😀😀.");
    }
    else {
  
      let obj = {
        about: {
            updatedAt : new Date().toISOString()
        },
        list_Of_Available_Exams: {
            updatedAt : new Date().toISOString()
        },

      };
      Mongoose.model("examListModel", examListModel).create(obj, async (err1, result1) => {
        if (err1) {
          console.log("examListModel  creation error", err1);
        } else {
          console.log("examListModel created 😀😀");
        }
      });
    }
  });