import mongoose from 'mongoose';
const schema = mongoose.Schema;
import mongoosePaginate from 'mongoose-paginate';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';
import status from '../enums/status';
import CATEGORY from "../enums/faqCategory"

const options = {
    collection: "faq",
    timestamps: true
};

const schemaDefination = new schema(
    {
        question: { type: String },
        answer: { type: String },
        status: { type: String, default: status.ACTIVE },
        categoryId : {
             type : String,
            ref :'faqCategoryModel'
            }
    },
    options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("faq", schemaDefination);

