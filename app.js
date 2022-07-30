const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" });
require("./db/conn");

// const User = require("./model/userSchema");
app.use(express.json()); //' Middleware to convert whichever is received int the json format into object and show us.
const PORT = process.env.PORT;

// we link the router files to make our route easy
app.use(require("./router/auth"));

const middleware = (req, res, next) => {
    console.log(`Hello my Middleware`);
    next();
};

app.get("/", (req, res) => {
    res.send(`Hello World from the server app.js`);
});

app.get("/about", middleware, (req, res) => {
    console.log("Hello My About");
    res.send(`Hello About World from the server`);
});

app.get("/aboutus", (req, res) => {
    res.send(`Hello AboutUS World from the server`);
});

app.get("/signin", (req, res) => {
    res.send(`Hello signin World from the server`);
});

app.get("/signup", (req, res) => {
    res.send(`Hello signup World from the server`);
});

// Routing
app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
});
