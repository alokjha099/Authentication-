import express from "express";
import { registerUser, verifyUser, login, getMe, logoutUser } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
// I didn't wrote ../controller/User.controller.js in the end and that has caused an error
// keep in mind to write the full name of the imported file

const router=express.Router();

router.post("/register",registerUser); 
router.get("/verify/:token",verifyUser);
// anything after : in url will be added in the token variable
router.post("/login",login);
router.get("/me",isLoggedIn,getMe);
// since middleware execute in between the client and route we write it in between
// the route and its url call. (isLoggedIn)

router.get("/logout",isLoggedIn,logoutUser);
// isLoggedIn ensures that user have logged in previously and have token-which he gets 
// during logging in is present in his cookies

export default router;

// this is boiler plate code and has to be imported 