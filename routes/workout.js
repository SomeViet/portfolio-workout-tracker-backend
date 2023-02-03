const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);

router.get("/", (req, res) => {
    let user = 1; // this needs to be from the req param, which identifies the current logined user

    // Axios isn't setup to send body data via Get Request, so to send user information via Params
    let username = req.query.username;

    knex.select(
        "exercises.id",
        "exercises.day",
        "exercises.exercise",
        "exercises.sets",
        "exercises.reps",
        "exercises.weight",
        "week_exercise.user_id",
        "week_exercise.week_id"
    )
        .from("exercises")
        .leftJoin("week_exercise", "week_exercise.exercise_id", "exercises.id")
        .where("user_id", user)
        // .orderBy("posts.id", "desc");
        .then((query) => {
            res.status(200).json({ query });
        });
});

module.exports = router;
