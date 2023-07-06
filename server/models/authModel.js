
import mongoose from "mongoose"


const registerSchema = new mongoose.Schema({
     userName : {
          type : String,
          required : true
     },
     email : {
          type: String,
          required : true
     },
     password : {
          type: String,
          required : true,
          select : false
     },
     image : {
          type: String,
          required : true
     }
},{timestamps : true});


const registerModel =mongoose.model('user',registerSchema);
export default registerModel;