import jwt from "jsonwebtoken"

export const authMiddleware = async(req,res,next) => {
     const {authToken} = req.cookies;
     if(authToken){
          const deCodeToken = await jwt.verify(authToken,"ASHDFKLAHSD2323");
          req.myId = deCodeToken.id;
          next();
     }else{
          res.status(400).json({
               error:{
                    errorMessage: ['Please Loing First']
               }
          })
     } 
}