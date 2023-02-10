const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);

router.get("/", (req, res) => {
    // Grab the client's username
    let userId = req.query.userId;

    // Grab all exercises related to username
    knex.select(
        "weeks.user_id",
        "weeks.week_id",
        "week_exercise.exercise_id",
        "exercises.day",
        "exercises.exercise",
        "exercises.sets",
        "exercises.reps",
        "exercises.weight"
    )
        .from("weeks")
        // Left Join = filtering = match records based on matching pair of WeekID and UserID
        .leftJoin("week_exercise", function () {
            this.on("weeks.week_id", "=", "week_exercise.week_id").on(
                "weeks.user_id",
                "=",
                "week_exercise.user_id"
            );
        })
        .leftJoin("exercises", "exercises.id", "week_exercise.exercise_id")
        .where("weeks.user_id", userId)

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

    if (exercise) {
        knex.raw(
            // Call the stored procedure to add exercise with the parameters
            // Order of parameters matter - in relation to stores procedure declaration
            `call portfolio_workout_tracker.create_exercise('${exercise.userId}','${exercise.week_id}' , '${exercise.day}', '${exercise.exercise}', '${exercise.sets}', '${exercise.reps}', '${exercise.weight}')`
        )
            .then((result) => {
                let condensedResult = result[0][0][0];

                // If the row was updated properly
                if (condensedResult) {
                    // take payload and return it to update workoutData
                    condensedResult.exerciseId;

                    res.status(200).json({
                        message: "Exercise Added",
                        exerciseId: condensedResult.exerciseId,
                    });
                } else {
                    res.status(400).json({ message: "No record was added" });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else console.log(exercise);
});

router.post("/addweek", (req, res) => {
    let newWeekRecord = req.body;

    knex("weeks")
        .insert(newWeekRecord)
        .then((_) => {
            res.status(200).json({ message: "Week Added" });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.delete("/deleteweek", (req, res) => {
    let deleteWeekRecord = req.body;
    console.log(deleteWeekRecord.week_id, deleteWeekRecord.user_id);

    knex("exercises")
        .leftJoin("week_exercise", "week_exercise.exercise_id", "exercises.id")
        .where("week_exercise.week_id", deleteWeekRecord.week_id)
        .where("week_exercise.user_id", deleteWeekRecord.user_id)
        .del()
        .then(() => {
            return knex("weeks")
                .where(deleteWeekRecord)
                .del()
                .then((result) => {
                    console.log("Delete Succeeded");
                    res.status(200).json({ message: "Week Deleted" });
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });

    knex("weeks")
        .where(deleteWeekRecord)
        .del()
        .then((result) => {
            if (result === 1) {
                console.log("Delete Succeeded");
                res.status(200).json({ message: "Week Deleted" });
            } else console.log(result);
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = router;
