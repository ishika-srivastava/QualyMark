const express = require("express");
const routes = express.Router();

const { loginUser, registerUser } = require("../controller/user.controller");

routes.post("/login", loginUser);
routes.post("/register", registerUser);

module.exports = routes;
