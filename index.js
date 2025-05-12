// we can bring data from different libraries in 2 ways
// require->commonjs and import->module(have to import that library in package.json) 

// const express = require('express')
// we removed the require cause we used  {"type":"module"}

import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser"
// we used userRoutes cause it was a default export on their part
// sometimes we need to use db.js because it may cause error otherwise



dotenv.config();


const app = express()
const port=process.env.PORT || 4000;
// did this to capture the fallbacks



app.use(
    cors({
        origin:process.env.BASE_URL,
        credentials:true,
        methods:['GET','PUT','POST','DELETE'],
        allowedHeaders: ['Content-Type','Authentication']

    })
)

app.use(express.json())
// used for telling backend we are sending data in JSON format
app.use(express.urlencoded({extended:true}))
// when we want to send data encoded in url we use this ,by making extended:true
// we ensure that latest urlencoded is used
app.use(cookieParser());
// witht this syntax and library now we can access cookies section 


app.get('/', (req, res) => {
  res.send('My Small Server')
//   (req, res) => {res.send('My Small Server') this portion is also called Callback and
// Controller cause what to do next is controlled from here only 
})

app.get('/alok',(req,res)=>{
    // /alok and alok are diffent mind that
    res.send("Alok's Port")
})

db(); // database connection 

app.use("/api/v1/users",userRoutes);
// now whenever new route value like users/register arrive, automatically tranfer to
// user.route.js page and align with the given routes


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})