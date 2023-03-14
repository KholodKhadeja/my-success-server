const express = require('express');
const router = express.Router();

const usersRouter = require("./users");
router.use("/users", usersRouter);
// const authRouter = require("../api/auth");
// router.use("/auth", authRouter);

module.exports=router;