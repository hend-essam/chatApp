import express from "express";
import RegisterUser from "../controller/registerUser";
import CheckEmail from "../controller/checkEmail";
import CheckPassword from "../controller/checkPassword";
import UserDetails from "../controller/userDetails";
import Logout from "../controller/logout";
import UpdateUserDetails from "../controller/updateUserDetails";
import Login from "../controller/loginUser";

const routes = express.Router();

// user api
routes.post("/register", RegisterUser);
// login
routes.post("/login", Login);
// check user email
routes.post("/email", CheckEmail);
// check user password
routes.post("/password", CheckPassword);
// login user details
routes.get("/userDetails", UserDetails);
// logout user
routes.get("/logout", Logout);
// update user details
routes.put("/updateUserDetails", UpdateUserDetails);

export default routes;
