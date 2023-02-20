const express = require("express");
const knex = require("knex")(require("../knexfile.js").development);
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const passport = require("passport");

require("dotenv").config();

// Create a login endpoint which kickstarts the auth process and takes user to a consent page
// Here, you can also specify exactly what type of access you are requesting by configuring scope: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
// ie: passport.authenticate("github", { scope: ["user:email", "repo"] })
router.get("/github", passport.authenticate("github", { session: false }));

// GitHub auth Callback: http://localhost:5050/auth/github/callback
// This is the endpoint that GitHub will redirect to after user responds on consent page
router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
    }),
    (_req, res) => {
        // Successful authentication, redirect to client-side application
        console.log("Github Auth Success");
        res.redirect(process.env.CLIENT_URL + "#");
    }
);

// Manual Login

router.post("/login", (req, res) => {
    const { username, password, github_id } = req.body;
    let dbpassword = "";
    let dbgithub_id = "";

    // Search database for password associated with username if it exists
    knex.select("*")
        .from("users")
        .where("username", username)
        .then((result) => {
            // If username exists, perform password check
            if (result[0]) {
                dbuserid = result[0].id;
                dbpassword = result[0].password;
                dbgithub_id = result[0].github_id;
                dbname = result[0].name;

                if (password && dbpassword) {
                    bcrypt.compare(
                        password,
                        dbpassword,
                        function (err, result) {
                            // Successful login
                            if (result) {
                                let jsontoken = jwt.sign(
                                    { name: username },
                                    process.env.JSONSECRETKEY
                                );
                                // Json Token Check
                                console.log("Json token retrieved");
                                res.status(200).json({
                                    userid: dbuserid,
                                    name: dbname,
                                    username: username,
                                    token: jsontoken,
                                    message: "Login Successful",
                                    incorrect: false,
                                });

                                // All error cases
                            } else {
                                res.status(401).json({
                                    token: "",
                                    message: "Incorrect username/password",
                                    incorrect: true,
                                });
                            }
                        }
                    );
                } else if (
                    github_id &&
                    dbgithub_id &&
                    github_id === dbgithub_id
                ) {
                    let jsontoken = jwt.sign(
                        {
                            name: username,
                        },
                        process.env.JSONSECRETKEY
                    );
                    // Json Token Check
                    console.log("Json token retrieved");
                    res.status(200).json({
                        token: jsontoken,
                        message: "Login Successful",
                        incorrect: false,
                    });
                } else {
                    return;
                }
            } else {
                res.status(401).json({
                    token: "",
                    message: "Incorrect username/password",
                    incorrect: true,
                });
            }
        });
});

// User profile endpoint that requires authentication
router.get("/profile", (req, res) => {
    // Passport stores authenticated user information on `req.user` object.
    // Comes from done function of `deserializeUser`
    // If `req.user` isn't found send back a 401 Unauthorized response

    if (req.user === undefined) {
        console.log("Test1");
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Test2");
    // If user is currently authenticated, send back user info
    res.status(200).json(req.user);
});

// Create a logout endpoint
router.get("/logout", (req, res) => {
    // Passport adds the logout method to request, it will end user session
    req.logout((error) => {
        // This callback function runs after the logout function
        if (error) {
            return res.status(500).json({
                message: "Server error, please try again later",
                error: error,
            });
        }
        // Redirect the user back to client-side application
        res.redirect(process.env.CLIENT_URL);
    });
});

// Export this module
module.exports = router;
