import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var subAdminModel = new Schema({

   name : {
    type: String,
   },
   email : {
    type: String,
   },
   password : {
    type : String
   },
   permission : {
    medicalEducationCMS : {type : Boolean , default : false},
    medBoundList : {type : Boolean , default : false},
    medBoundTimes : {type : Boolean , default : false},
    aboutUsManagement : {type : Boolean , default : false},
    galleryManagement : {type : Boolean , default : false},
    faqManagement : {type : Boolean , default : false},
    helpCenterManagement : {type : Boolean , default : false},
    bannerManagement : {type : Boolean , default : false}
   }, 
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default: status.ACTIVE
    }
},
    { timestamps: true }
);
subAdminModel.index({ location: "2dsphere" })
subAdminModel.plugin(mongooseAggregatePaginate)
subAdminModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("subAdminModel", subAdminModel);


