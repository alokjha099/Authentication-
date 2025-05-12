import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
// pre defined library which is used for token generation

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
    // here we used json cause we are working on API and json is required their
  }

  console.log(req.body.email);

  //  check if user already exist
  try {
    const existingUser = await User.findOne({ email });
    // we used await here because we know databse exist in another continent or
    // container and we have to wait for fetching it and User has the ability to call upon
    // database becuase of  User=mongoose property which provide it the ability
    if (existingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;
    // verification field would contain token as it is sent to database for
    // future reference

    await user.save();
    // we await for database to save token  which is in another container

    // send token an email to user

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption={
        from: process.env.MAILTRAP_SENDERMAIL,
         to: user.email,
    subject: "Verify your email",
    text: `Please Check the following link:
           ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain‑text body
    };

    await transporter.sendMail(mailOption);
    // part of nodemailer library 

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    })
  } catch (error) {
    res.status(400).json({
      message: "User not registered ",
      error,
      success: false,
    })
  }
  /*
     the name, email, and password variables are using destructuring assignment to extract individual properties from the req.body object. This means:

name will hold the value of req.body.name

email will hold the value of req.body.email

password will hold the value of req.body.password

Key points:

Destructuring assignment doesn't modify req.body. It simply creates separate variables (name, email, password) and assigns the corresponding values from req.body to these variables.

No copies are made: The values are simply extracted and assigned to new variables. If you modify the name, email, or password variables later in the code, it won't affect the original req.body.
    */
};

 const verifyUser= async (req,res)=>{
    // get token from url
    const {token}=req.params;
    // params take data from the url, we have previously attached our verification 
    // token in the url which we are fetching now  
    console.log(token);

    if(!token){
      return res.status(400).json({
        message:"Invalid token",
      })
    }
    const user=await User.findOne({
      verificationToken: token
      // verificationToken is added with colon here becuase this token is to match with 
      // verificationToken column in my database and await cause database is in different
      // container
    })

    console.log(user);


    if(!user){
      return res.status(400).json({
        message:"Invalid Token"
      })
    }

    user.isVerified=true;
    user.verificationToken=undefined;

    await user.save();

    res.status(200).json({
      message: "User verified successfully",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  // save the changes made in isVerified after we have verified
  // user now contain the instance of the database that matches the particular token
  // and can be updated accessing it 
  };

const login = async (req,res) =>{

  const {email,password}= req.body;

  if(!email || !password){
    return res.status(400).json({
      message: "All fields are required",
    })
  }

  try{
    const user= await User.findOne({email})
    // User has the access to database cause its associated with mongoose library

    if(!user){
      return res.status(400).json({
        message:"Invalid email or password",
      });
    }

   const isMatch= await bcrypt.compare(password,user.password)
  //  we compare user sent password and our stored password in database which has been 
  // bcrypted by bcypting the user sent password as well

   console.log(isMatch);

   if(!isMatch){
     return res.status(400).json({
        message:"Invalid email or Password",
      });
   }

   const token=jwt.sign({
    id:user._id,
    role:user.role
   },
   process.env.JWT_SECRET,{
    expiresIn:'24h'
   }
  );
  //we are using jwt token cause we want to send it as a response to a logged in 
  // user that they have created a logged in the account and have set a time 
  // limit to 24 hours after which user have to login again then another jwt token will
  // be produced
  const cookieOption={
    httpOnly:true,
    secure:true,
    maxAge: 24*60*60*1000
  }
  // cookie option is just an object I created 
  // httponly: define that your cookie is in backend only
  // secure: ensure that it remains secured
  // maxAge: set the time token will be stored in our cookies

  res.cookie("token",token,cookieOption)
  // res means we are sending the token to ourselves or our browser cookies 

  res.status(200).json({
    success:true,
    message: "Login Successful",
    token,
    user:{
      id:user._id,
      name: user.name,
      role: user.role, 
    },
  });


  }catch(error){

  }

  // 
}

const getMe= async (req,res)=>{
  try{
    const user= await User.findById(req.user.id).select('-password')
    // select(-password) removes the password filed from getting fetched in data
    // here User is impowered by mongoose to access the database also the id we are 
    // accessing is req.user.id is actully fetched from jwt(id:user._id) the database id only
    console.log(user)
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }

    res.status(200).json({
      success:true,
      user,
    })
  }catch(error){
    console.log("error in getme",error)
  }
}

const logoutUser= async (req,res)=>{
  try{
    res.cookie("token","",{});
    res.status(200).json({
      success:true,
      message:"Logged Out Successfully"
    });
  }catch(error){
    
  }
}

const forgotPassword= async (req,res)=>{
  try{
    // get email
    // find user based on email
    // reset token + reset expiry -> Date.now() + 10*60*1000 => user.save()
    // send mail => design url
    
  }catch(error){
    
  }
}

const resetPassword= async (req,res)=>{
  try{
    // collect token from params
    // password from req.body
    const {token}=req.params
    const {password}=req.body
    try{
      const user=await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
        // set an expiry date which is greater-than($gt) current Time for reset password

      })
      // set password in user
      // resetToken, resetExpiry => reset
      // save 
    }catch(error){

    }
  }catch(error){
    
  }
}


export { 
  registerUser , 
  verifyUser,
   login,
   getMe,
   forgotPassword,
   logoutUser,
   resetPassword
 };
