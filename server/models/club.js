import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

var Clubodel = new Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },

    activities : {
        type : String,
    },

    format : {
        type: String,
    },
    photo : {
        type : String
    }
  },
  { timestamps: true }
);
Clubodel.index({ location: "2dsphere" })
Clubodel.plugin(mongooseAggregatePaginate)
Clubodel.plugin(mongoosePaginate);
module.exports = Mongoose.model("Club", Clubodel);