import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var medBoundModel = new Schema({

    about: {
        description : {
            type: String
        },
        benefits:{
            type: String
        },
        collarators:[
            { file : {type : String}}
        ],
        features:{
            type: String
        },
        certificate_Link : {
            type: String
        },
        organisation_Link : {
            type: String
        },
        updatedAt : {
            type: Date
        }
    },
    campus: {
        description : {
            type: String
        },
        activities:{
            type: String
        },
        signUpLink:{
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
medBoundModel.index({ location: "2dsphere" })
medBoundModel.plugin(mongooseAggregatePaginate)
medBoundModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("medBoundModel", medBoundModel);



Mongoose.model("medBoundModel", medBoundModel).find({}, async (err, result) => {
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
            benefits: "Default Benifits",
            collarators:[
                { file : "No File"}
            ],
            features: "Default feature",
            certificate_Link : "Default certificate",
            organisation_Link : "Default organisation_Link",
            updatedAt : new Date().toISOString()
        },
        campus: {
            description :  "Default description",
            activities : "Default activites",
            signUpLink: "Default link",
            updatedAt : new Date().toISOString()
        }
      };
      Mongoose.model("medBoundModel", medBoundModel).create(obj, async (err1, result1) => {
        if (err1) {
          console.log("medBoundModel  creation error", err1);
        } else {
          console.log("medBoundModel created 😀😀");
        }
      });
    }
  });