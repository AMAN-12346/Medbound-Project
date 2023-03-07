import froummodel from "../../../models/forum";
import status from '../../../enums/status';
import userType from "../../../enums/userType";
import { query } from "express";


const froumServices = {
    createForum : async(instaintObj) => {
        return await froummodel.create(instaintObj)
    },

    UpdateForum : async(query, instaintObj) => {
        return await froummodel.findByIdAndUpdate(query, instaintObj, {new : true});
    },
    
    findForum : async(query) => {
        return await froummodel.findOne(query)
    }
}

module.exports = { froumServices };