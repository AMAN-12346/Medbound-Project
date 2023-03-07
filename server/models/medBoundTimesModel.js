import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var medBoundTimesModel = new Schema({

    about: {
        description : {
            type: String
        },
        features:{
            type: String
        },
        bulletin : {
            type: String
        },
        link : {
            type: String
        },

        updatedAt : {
            type: Date
        }
    },
    internship: {
        description : {
            type: String
        },
        activities:{
            type: String
        },
        format:{
            type: String
        },
        link : {
            type: String
        },
        updatedAt : {
            type: Date
        }
    },
    career: {
        courseName : {
            type: String
        },
        description:{
            type: String
        },
        activities:{
            type: String
        },
        format:{
            type: String
        },
        link : {
            type: String
        },
        updatedAt : {
            type: Date
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
medBoundTimesModel.index({ location: "2dsphere" })
medBoundTimesModel.plugin(mongooseAggregatePaginate)
medBoundTimesModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("medBoundTimesModel", medBoundTimesModel);



Mongoose.model("medBoundTimesModel", medBoundTimesModel).find({}, async (err, result) => {
    if (err) {
      console.log("DEFAULT medBound ERROR", err);
    }
    else if (result.length != 0) {
      console.log("Default medBound 😀😀.");
    }
    else {
  
      let obj = {
        about: {
            description : "Default Description",
            features: "Default feature",
            bulletin : "Default certificate",
            link : "Default Link",
            updatedAt : new Date().toISOString()
        },
        internship: {
            description :  "Default description",
            activities : "Default activites",
            format : "Default format",
            link: "Default link",
            updatedAt : new Date().toISOString()
        },
        career: {
            courseName :  "Default career",
            description : "Default description",
            activities : "Default activities",
            format : "Default format",
            link: "Default link",
            updatedAt : new Date().toISOString()
        }

      };
      Mongoose.model("medBoundTimesModel", medBoundTimesModel).create(obj, async (err1, result1) => {
        if (err1) {
          console.log("medBoundTimesModel  creation error", err1);
        } else {
          console.log("medBoundTimesModel created 😀😀");
        }
      });
    }
  });