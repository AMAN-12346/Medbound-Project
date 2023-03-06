import config from "config";
import jwt from "jsonwebtoken";
import userModel from "../models/user";
import apiError from './apiError';
import responseMessage from '../../assets/responseMessage';

module.exports = {
  verifyToken(req, res, next) {
    if (req.headers.token) {
      jwt.verify(req.headers.token, config.get('jwtsecret'), (err, result) => {
        if (err) {
          throw apiError.unauthorized();
        }
        else {
          console.log(result)
          userModel.findOne({ _id: result._id }, (error, result2) => {
            console.log("16============",result2);
            if (error) {
              return next(error)
            }
            else if (!result2) {
              // throw apiError.notFound(responseMessage.USER_NOT_FOUND);
              return res.status(404).json({
                responseCode:404,
                responseMessage:"USER NOT FOUND"
              })
            }
            else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({
                  responseCode:403,
                  responseMessage:"You Have been blocked by admin ."
                })}
              else if (result2.status == "DELETE") {
                return res.status(401).json({
                  responseCode:401,
                  responseMessage:"Your account has been deleted by admin ."
                })}
              else {
                req.userId = result._id;
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    } else {
      throw apiError.badRequest(responseMessage.NO_TOKEN);
    }
  },

  verifyTokenBySocket: (token) => {
    return new Promise((resolve, reject) => {
      try {
        if (token) {
          jwt.verify(token, config.get('jwtsecret'), (err, result) => {
            if (err) {
              reject(apiError.unauthorized());
            }
            else {
              userModel.findOne({ _id: result.id }, (error, result2) => {
                if (error)
                  reject(apiError.internal(responseMessage.INTERNAL_ERROR));
                else if (!result2) {
                  reject(apiError.notFound(responseMessage.USER_NOT_FOUND));
                }
                else {
                  if (result2.status == "BLOCK") {
                    reject(apiError.forbidden(responseMessage.BLOCK_BY_ADMIN));
                  }
                  else if (result2.status == "DELETE") {
                    reject(apiError.unauthorized(responseMessage.DELETE_BY_ADMIN));
                  }
                  else {
                    resolve(result2._id);
                  }
                }
              })
            }
          })
        } else {
          reject(apiError.badRequest(responseMessage.NO_TOKEN));
        }
      }
      catch (e) {
        reject(e);
      }
    })


  },
}