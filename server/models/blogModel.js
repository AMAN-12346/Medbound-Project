import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var blogModel = new Schema({

    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default: status.ACTIVE
    }
},
    { timestamps: true }
);
blogModel.index({ location: "2dsphere" })
blogModel.plugin(mongooseAggregatePaginate)
blogModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("blogModel", blogModel);