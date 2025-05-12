import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema= new mongoose.Schema(
    {
        name:String,
        email:String,
        password:String,
        roles:{
            type:String,
            enum: ["user","admin"],
            default:"user"
        },
        isVerified:{
            type:Boolean,
            default: false
        },
        verificationToken:{
            type:String,
        },
        resetPasswordToken:{
            type:String,
        },
        resetPasswordExpires:{
            type:Date,
        }
    },{
        timestamps:true
        // by making this true createdAt and UpdatedAt values are added automatically
        // in userSchema
    }
);

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10)
        // now whenever password is fetched or updated it will be encrypted 
    }
    next()
})

// we use hook which help in performing some action just before or after an action like in 
// this case "save" and we use next() to let the mongoose know that our pre action has
// been finished. userSchema.pre() or userSchema.post




const User=mongoose.model("User",userSchema)



export default User;