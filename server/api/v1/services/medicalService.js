import Internship from "../../../models/Internship";
import froummodel from "../../../models/forum";
import WebinarModel from "../../../models/webinar";
import tutoralVideoModel from "../../../models/tutorialVideoByCatgory";
import flashCardModel from "../../../models/flashCard";
import mentorModel from "../../../models/mentor";
import AluminiModel from "../../../models/Alumni";
import EventModel from "../../../models/Event";
import blogModel from "../../../models/blogModel";


import status from "../../../enums/status";

const medicalService = {

  getUpdatedInternship : async () => {
    let date = await Internship.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },

  getUpdatedForums : async () => {
    let date = await froummodel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },
  getUpdatedWebnar : async () => {
    let date = await WebinarModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },
  getUpdatedTutorial : async () => {
    let date = await tutoralVideoModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },
  getUpdatedFlashCard : async () => {
    let date = await flashCardModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },
  getUpdatedMentor : async () => {
    let date = await mentorModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },
  getUpdatedAlumni : async () => {
    let date = await AluminiModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },

  getUpdatedEvents : async () => {
    let date = await EventModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },
  getUpdatedBlog : async () => {
    let date = await blogModel.find({ status : { $ne : status.DELETE }}).sort({createdAt : -1})
    if(date && date.length){
        return date[0].updatedAt;
    }else{
        return 'NA';
    }

  },

 
};

module.exports = { medicalService };
