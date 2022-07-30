const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
    res.send(`Hello World from the server router.js`);
});

//- Using Promises
// router.post("/register", (req, res) => {
//     //, Js Object Destructuring concept
//     const { name, email, phone, password, cpassword } = req.body;

//     if (!name || !email || !phone || !password || !cpassword) {
//         return res
//             .status(422)
//             .json({ error: "Please Fill the Field Property" });
//     }

//     //- We will use Promises here
//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Email Already Exists" });
//             }
//             const user = new User({ name, email, phone, password, cpassword });

//             //` This below method returns Promises so we should use .then()
//             user.save()
//                 .then(() => {
//                     res.status(201).json({
//                         message: "User Registered Successfully",
//                     });
//                 })
//                 .catch((err) =>
//                     res.status(500).json({ error: "Failed to Register" })
//                 );
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// - Using async and await

router.post("/register", async (req, res) => {
    //, Js Object Destructuring concept
    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
        return res
            .status(422)
            .json({ error: "Please Fill the Field Property" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email Already Exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password are not Matching" });
        } else {
            const user = new User({ name, email, phone, password, cpassword });

            await user.save();

            res.status(201).json({ message: "User Registered Successsfully" });
        }
    } catch (err) {
        console.log(err);
    }
});

// - Login Route

router.post("/signin", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please Fill the Data" });
        }

        //-If we want to read the data from the database for verifying
        const userLogin = await User.findOne({ email: email }); //, First email is from database second parameter email is user entered one.
        // console.log(userLogin); //` To see what we got in the userLogin if matched email id is found.

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            // console.log(token);
            //- Cookie storing using cookie method
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000), // expires after 30 days
                httpOnly: true,
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials" });
            } else {
                res.json({ message: "User Signin Successfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
