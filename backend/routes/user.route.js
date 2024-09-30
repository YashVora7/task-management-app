const { Router } = require("express");
const { login, signup } = require("../controllers/user.controller");
const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);

module.exports = userRouter;
