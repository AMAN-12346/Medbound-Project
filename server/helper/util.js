import config from "config";
import Joi from "joi";
import jwt from "jsonwebtoken";
//import twilio from 'twilio';
import Sender from "aws-sms-send";
var aws_topic = "arn:aws:sns:us-east-1:729366371820:coinbaazar";
var config2 = {
  AWS: {
    accessKeyId: config.get("AWS.accessKeyId"),
    secretAccessKey: config.get("AWS.secretAccessKey"),
    region: config.get("AWS.region"),
  },
  topicArn: aws_topic,
};
var sender = new Sender(config2);

import nodemailer from "nodemailer";
import cloudinary from "cloudinary";
//import stackingModel from "../models/stackingModel"
import status from "../enums/status";
import userType from "../enums/userType";

import userModel from "../models/user";

cloudinary.config({
  cloud_name: "dhdvtnehi",
  api_key: "516765691967195",
  api_secret: "VogCyCi7YWCwKUSHduwVxpd5VxE",
});

// const accountSid = config.get('twilio.accountSid');
// const authToken = config.get('twilio.authToken');
// const client = require('twilio')(accountSid, authToken);
//import qrcode from 'qrcode';

module.exports = {
  getOTP() {
    var otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  },

  getImageUrlUpdated: async (filePath) => {
    var result = await cloudinary.v2.uploader.upload(filePath);
    return result.secure_url;
  },

  getImageMultipleUrl(filePath) {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(filePath, function (error, result) {
        if (error) {
          reject(error);
        } else {
          console.log("result===>>", result.secure_url);
          resolve(result.secure_url);
        }
      });
    });
  },
  // getImageMultipleUrl(image) {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader.upload(image, function (error, result) {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         console.log("result===>>", result.url);
  //         resolve(result.url);
  //       }
  //     });
  //   });
  // },

  uploadImage(image) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, function (error, result) {
        console.log(result);
        if (error) {
          reject(error);
        } else {
          resolve(result.url);
        }
      });
    });
  },

  sendSms: (number, otp) => {
    sender
      .sendSms(`Your otp is ${otp}`, config.get("AWS.smsSecret"), false, number)
      .then(function (response) {
        return response;
      })
      .catch(function (err) {
        return err;
      });
  },

  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.get("jwtsecret"), {
      expiresIn: "24h",
    });
    return token;
  },

  sendMail: async (to, name, link) => {
    let html = `<div style="font-size:15px">
                <p>Hello ${name},</p>
                <p>Please click on the following link "${link}">
                  Set a new password now
                </a>
                    If you did not request this, please ignore this email and your password will remain unchanged.
                </p> 
                  <p>
                      Thanks<br>
                  </p>
              </div>`;
    var findCredentialsRes = await findCredentials();
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: findCredentialsRes.email,
        pass: findCredentialsRes.password,
      },
    });
    var mailOptions = {
      from: findCredentialsRes.email,
      to: to,
      subject: "Reset Link",
      html: html,
    };
    return await transporter.sendMail(mailOptions);
  },

  getImageUrl: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files[0].path, {
      resource_type: "raw",
    });
    console.log("82", result);
    return result;
  },

  genBase64: async (data) => {
    return await qrcode.toDataURL(data);
  },

  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    return result.secure_url;
  },

  sendEmailOtp: async (email, otp) => {
    var sub = `Use the One Time Password(OTP) ${otp} to verify your accoount.`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.get("nodemailer.email"),
        pass: config.get("nodemailer.password"),
        // "user": "customerservice@ejobbing.com",
        // "pass": "Thrive123"
      },
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: "Otp for verication",
      text: sub,
      // html: html
    };
    return await transporter.sendMail(mailOptions);
  },
};
