/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const casual = require("casual");

exports.seed = function (knex) {
    let mockExercise = "";
    let mockWeek = 2;
    let mockUser = 1;

    return knex("exercises")
        .then(() => {
            const mockExercise = {
                day: "Monday",
                exercise: "Bench Press",
                sets: 3,
                reps: 8,
                weight: 145,
            };
            return knex("exercises").insert(mockExercise);
        })
        .then(function (result) {
            return knex.select("*").from("exercises").where("id", result[0]);
        })
        .then((result) => {
            mockExercise = result[0].id;

            return knex("week_exercise").insert({
                user_id: mockUser,
                week_id: mockWeek,
                exercise_id: mockExercise,
            });
        });

    // // Delete fake user
    // .then(() => {
    //     return knex("users").del().where({ username: "fake-user" });
    // })

    // // Create fake user
    // .then(() => {
    //     return knex("users").insert({
    //         github_id: 11111111,
    //         username: "fake-user",
    //     });
    // })
};
