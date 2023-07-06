import mongoose from "mongoose"

const databaseConnect = () => {
     mongoose.connect("mongodb+srv://alok08jha:PVbFcrlx78s1xLHu@cluster0.3bgvpp6.mongodb.net/?retryWrites=true&w=majority",{
          useNewUrlParser : true,
          useUnifiedTopology : true
     }).then(()=>{
          console.log('Mongodb Database Connected')
     }).catch(error=>{
          console.log(error)
     })
}
export default databaseConnect;