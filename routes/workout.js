const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);

router.get("/", (req, res) => {
    // Grab the client's username
    let username = req.query.username;

    // Grab all exercises related to username
    knex.select(
        "exercises.id",
        "exercises.day",
        "exercises.exercise",
        "exercises.sets",
        "exercises.reps",
        "exercises.weight",
        "week_exercise.user_id",
        "week_exercise.week_id",
        "users.username"
    )
        .from("exercises")
        .leftJoin("week_exercise", "week_exercise.exercise_id", "exercises.id")
        .leftJoin("users", "users.id", "week_exercise.user_id")
        .where("username", username)

        // respond back with query
        .then((query) => {
            res.status(200).json({ query });
        })
        .catch((e) => {
            console.log(e);
        });
});

router.post("/addexercise", (req, res) => {
    let exercise = req.body;
    console.log(exercise);

    if (exercise) {
        knex.raw(
            `call portfolio_workout_tracker.create_exercise('${exercise.username}','${exercise.week_id}' , '${exercise.day}', '${exercise.exercise}', '${exercise.sets}', '${exercise.reps}', '${exercise.weight}')`
        )
            .then((result) => {
                // take payload and update workoutData
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    } else console.log(exercise);
});

module.exports = router;
