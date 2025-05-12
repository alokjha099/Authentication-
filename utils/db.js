
import mongoose  from "mongoose";

import dotenv from "dotenv";

dotenv.config();
// we do this to ensure that we can use the env variables in our code
// we can use this to check if the connection is successful


const db=()=>{
    mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to database")
    // we can use this to check if the connection is successful
    // and then we can start the server
    // app.listen(port, () => {
    //     console.log(`Example app listening on port ${port}`)
    //   })
})
.catch((err)=>{
    console.log("Error in connecting to database",err)
})   
}

export default db;