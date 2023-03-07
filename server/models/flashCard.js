import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import bcrypt from 'bcryptjs';

var flashCardModel = new Schema({

    categoryId: {
        type: String,
        ref: 'flashCardCategoryModel'
    },
    subCategoryId: {
        type: String,
        ref: 'flashCardSubCategoryModel'
    },
    title: {
        type: String
    },
    authorName: {
        type: String
    },
    subject: {
        type: String
    },
    flashCards: [
        {
            question: {
                type: String,
                trim: true
            },
            image: {
                type: String,
                trim: true
            },
            Description : {
                type: String,
                trim: true
            }

        }
    ],
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default: status.ACTIVE
    }
},
    { timestamps: true }
);
flashCardModel.index({ location: "2dsphere" })
flashCardModel.plugin(mongooseAggregatePaginate)
flashCardModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("flashCardModel", flashCardModel);