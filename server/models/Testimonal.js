import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
import staticType from "../enums/status";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const testimonialModel = new Schema({
  Testimonial_no: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: [status.ACTIVE, status.BLOCK],
    default: status.ACTIVE,
  },
});

module.exports = Mongoose.model("Testimonial", testimonialModel);

(async () => {
  let result = Mongoose.model("Testimonial", testimonialModel).find({});
  if (result.length != 0) {
    console.log("DEFAULT Testimonial content already  Created..😀😀");
  } else {
    var object1 = {
      Testimonial_no: "Testimonial 1",
      title: "Term And Conditions ",
      description:
        "A term and conditions agreement is the agreement that includes the terms, the rules and the guidelines of acceptable behavior and other useful sections to which users must agree in order to use or access your website and mobioe app.",
    };

    var object2 = {
      Testimonial_no: "Testimonial 2",
      title: "Term And Conditions ",
      description:
        "A term and conditions agreement is the agreement that includes the terms, the rules and the guidelines of acceptable behavior and other useful sections to which users must agree in order to use or access your website and mobioe app.",
    };

    var object3 = {
      Testimonial_no: "Testimonial 3",
      title: "Term And Conditions ",
      description:
        "A term and conditions agreement is the agreement that includes the terms, the rules and the guidelines of acceptable behavior and other useful sections to which users must agree in order to use or access your website and mobioe app.",
    };

    let testimonialResult = Mongoose.model(
      "Testimonial",
      testimonialModel
    ).create(object1, object2, object3);
    if (testimonialResult) {
      console.log("DEFAULT Testimonial Created..😀😀");
    }
  }
}).call();
