import formidable from 'formidable';
import validator from 'validator';
import registerModel from "../models/authModel.js"
import fs from "fs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

import console from 'console';


export const userRegister = (req, res) => {

     const form = formidable();
     form.parse(req, async (err, fields, files) => {
     console.log({fields})
     const {
          userName, email, password,confirmPassword,image
     } = fields;

     // const {image} = files;
     console.log(image)
     const error = [];

     if(!userName){
          error.push('Please provide your user name');
     }
     if(!email){
          error.push('Please provide your Email');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(!password){
          error.push('Please provide your Password');
     }
     if(!confirmPassword){
          error.push('Please provide your confirm Password');
     }
     if(password && confirmPassword && password !== confirmPassword){
          error.push('Your Password and Confirm Password not same');
     }
     if(password && password.length < 6){
          error.push('Please provide password mush be 6 charecter');
     }
     if(image.length === 0){
          error.push('Please provide user image');
     }
     if(error.length > 0){
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     } else {
          // const getImageName = files.image.originalFilename;
          // const randNumber = Math.floor(Math.random() * 99999 );
          // const newImageName = randNumber + getImageName;
          // files.image.originalFilename = newImageName;
          console.log("I'm here 1");
          console.log(error);
          // const newPath = __dirname + `/../../frontend/public/image/${files.image.originalFilename}`;

     try {


          const checkUser = await registerModel.findOne({
               email:email
          });
          if(checkUser) {
               console.log("I'm here 2");
               console.log(checkUser);
               res.status(404).json({
                    error: {
                         errorMessage : ['Your email already exited']
                    }
               })
          }else{
               // fs.copyFile(files.image.filepath,newPath, async(error) => {
                    const userCreate = await registerModel.create({
                         userName,
                         email,
                         password : await bcrypt.hash(password,10),
                         image
                    });

                    const token = jwt.sign({
                         id : userCreate._id,
                         email: userCreate.email,
                         userName: userCreate.userName,
                         image: userCreate.image,
                         registerTime : userCreate.createdAt
                    }, "ASHDFKLAHSD2323",{
                         expiresIn: "7d"
                    }); 

                    const options = { expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 )}

                    res.status(201).cookie('authToken',token, options).json({
                         successMessage : 'Your Register Successful',token
                    })

               // })
          }

          } catch (error) {
               console.log("I'm here 4")
               console.log(error);
               res.status(500).json({
               error: {
                         errorMessage : ['Interanl Server Error']
                    }
               })

          } 

               
     } 
          
     }) // end Formidable  
    
}

export const userLogin = async (req,res) => {
      const error = [];
      const {email,password} = req.body;
      if(!email){
          error.push('Please provide your Email');
     }
     if(!password){
          error.push('Please provide your Passowrd');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(error.length > 0){
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     }else {

          try{
               const checkUser = await registerModel.findOne({
                    email:email
               }).select('+password');

               if(checkUser){
                    const matchPassword = await bcrypt.compare(password, checkUser.password );

                    if(matchPassword) {
                         const token = jwt.sign({
                              id : checkUser._id,
                              email: checkUser.email,
                              userName: checkUser.userName,
                              image: checkUser.image,
                              registerTime : checkUser.createdAt
                         }, "ASHDFKLAHSD2323",{
                              expiresIn: "7d"
                         }); 
      const options = { expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 )}

     res.status(200).cookie('authToken',token, options).json({
          successMessage : 'Your Login Successful',token
     })

                    } else{
                         res.status(400).json({
                              error: {
                                   errorMessage : ['Your Password not Valid']
                              }
                         })
                    }
               } else{
                    res.status(400).json({
                         error: {
                              errorMessage : ['Your Email Not Found']
                         }
                    })
               }
                

          } catch{
               res.status(404).json({
                    error: {
                         errorMessage : ['Internal Sever Error']
                    }
               })

          }
     }

}

export const userLogout = (req,res) => {
     res.status(200).cookie('authToken', '').json({
          success : true
     })
}