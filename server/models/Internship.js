import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var Internship = new Schema(

    {
        name: {
            type: String
        },
        description: {
            type: String
        },
        Image: {
            type: String
        },
        link: {
            type: String
        },
        status : {
            type :String,
            default : status.ACTIVE
        }

    },
    { timestamps: true }
);

module.exports = Mongoose.model("Internship", Internship);

