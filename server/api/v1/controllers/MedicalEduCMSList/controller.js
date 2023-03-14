import Joi from "joi";
import Mongoose from "mongoose";
import _ from "lodash";
import config from "config";
import apiError from '../../../../helper/apiError';
import bcrypt from 'bcryptjs';
import commonFunction from '../../../../helper/util';
import jwt from 'jsonwebtoken';
import status from '../../../../enums/status';
import speakeasy from 'speakeasy';
import userType from "../../../../enums/userType";
const secret = speakeasy.generateSecret({ length: 10 });
import response from '../../../../../assets/response';

import responseMessage from '../../../../../assets/responseMessage';


import {medicalService} from '../../services/medicalService'

const { getUpdatedInternship,getUpdatedForums ,getUpdatedWebnar , getUpdatedTutorial,getUpdatedFlashCard , getUpdatedMentor,getUpdatedAlumni,getUpdatedEvents,getUpdatedBlog} = medicalService;




export class medEduController {


    /**
     * @swagger
     * /medEduCMS/medEduCMSList:
     *   get:
     *     tags:
     *       - medEduCMS
     *     description: medEduCMS
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: User created successfully
     *       409:
     *         description: This email already exists ./ This mobile number already exists.
     *       400:
     *         description:  Password and confirm password does not match
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async medEduCMSList(req, res, next) {

        try {
         
            let intership =  await getUpdatedInternship()
            let forms =  await getUpdatedForums()
            let webnar =  await getUpdatedWebnar()
            let tutorial =  await getUpdatedTutorial()
            let flashCard =  await getUpdatedFlashCard()
            let mentor =  await getUpdatedMentor()
            let alumni =  await getUpdatedAlumni()
            let events =  await getUpdatedEvents()
            let blog =  await getUpdatedBlog()

            let list = [
                {
                    type: 'About Us',
                    updatedAt: ''
                },
                {
                    type: 'Exam Module',
                    updatedAt: ''
                },
                {
                    type: 'Intership By Medbound',
                    updatedAt: intership
                },
                {
                    type: 'Forum By Social Clubs',
                    updatedAt: forms
                },
                {
                    type:'Webinars',
                    updatedAt: webnar
                },
                {
                    type:'Learning Tuitorial',
                    updatedAt: tutorial
                },
                {
                    type:'Flash Cards',
                    updatedAt: flashCard
                },
                {
                    type:'Mentors & Teachers',
                    updatedAt: mentor
                },
                {
                    type:'Alumnl List',
                    updatedAt: alumni
                },
                {
                    type:'Events',
                    updatedAt: events
                },
                {
                    type:'Blogs',
                    updatedAt: blog
                }
               

            ]


            return res.json(new response(list, responseMessage.DATA_FOUND));


        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }






}

export default new medEduController()