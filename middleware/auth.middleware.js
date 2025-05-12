import jwt from "jsonwebtoken";

export const isLoggedIn= async (req,res,next)=> {
    try{
        console.log(req.cookies);
        let token= req.cookies?.token 
        // The ?. is the optional chaining operator in JavaScript.
        //  It allows you to safely access properties of an object that might be null 
        // or undefined without causing an error.
        
        // we check for token in cookies of borwser which would be already saved if
        // the borwser had logged in previously 

        console.log('Token Found:',token?'Yes':'NO')

        if(!token){
            console.log("No token");
            return res.status(401).json({
                success:false,
                message: "Authentication failed"
                // if token not found in cookies then the user hadn't logged in before 
            })
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        // **jwt token was not working due to not being imported properly
        // keep in mind this kind of problems
        
        console.log("decoded data:",decoded)
        req.user=decoded;
        // here we are matching our jwt secret with the token in the cookies as the secret
        // key infulence and change the jwt token in a certain way which you can find in
        // jwt library home page. jwt.verify compares that and veirfy it 
        next();
    }catch(error){
        console.log("Auth middleware failure");
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
    //  ERROR: Cannot set headers after they are sent to the client 
    // this error was coming because we were using next() command here again and again
    // we have already sent the response and yet we were again and again sending the 
    //  response 
    // next()
}