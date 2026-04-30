import express from "express";
import RegisterUser from "../controller/registerUser";
import CheckEmail from "../controller/checkEmail";
import CheckPassword from "../controller/checkPassword";
import UserDetails from "../controller/userDetails";
import Logout from "../controller/logout";
import UpdateUserDetails from "../controller/updateUserDetails";
import SearchUsers from "../controller/searchUser";
import GetUsers from "../controller/getUsers";
import GetConversation from "../controller/getConversation";
import GetConversations from "../controller/getConversations";
import GetMessages from "../controller/getMessages";
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
// get all users
routes.get("/users", GetUsers);
// search users
routes.get("/users/search", SearchUsers);
// get all conversations
routes.get("/conversations", GetConversations);
// get conversation
routes.get("/conversation/:userId", GetConversation);
// get messages
routes.get("/messages/:conversationId", GetMessages);
// test endpoint
routes.get("/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

export default routes;
