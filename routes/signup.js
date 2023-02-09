const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);
const bcrypt = require("bcrypt");

const saltRounds = 9;

router.post("/", (req, res) => {
    const { username, name, password } = req.body;

    //Encrypt Password
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, function (err, encryptedPassword) {
            // Search database and compare usernames
            return knex
                .select("*")
                .from("users")
                .where("username", username)
                .then((result) => {
                    // If username is unique, enter it into system

                    // Generate user record and  initial week record
                    return knex("users")
                        .insert({
                            username: username,
                            name: name,
                            password: encryptedPassword,
                        })
                        .then((result) => {
                            let newUserId = result[0];
                            knex("weeks")
                                .insert({
                                    user_id: newUserId,
                                    week_id: 1,
                                })
                                .then((_) => {
                                    res.status(200).json({
                                        message: "Signup Successful",
                                        duplicate: false,
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    // // If duplicate username is detected, notify user
                    // ****KT - put this into catch error***
                    // res.status(400).json({
                    //     message: "Duplicate Username",
                    //     duplicate: true,
                })
                .catch((error) => {
                    console.log(
                        "Figure out how to handle MYsqlError something something",
                        error
                    );
                });
        });
    });
});

module.exports = router;
