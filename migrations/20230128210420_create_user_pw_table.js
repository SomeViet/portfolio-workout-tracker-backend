/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments("id").primary();
            table.integer("github_id");
            table.string("username").notNullable().unique;
            table.string("name");
            table.string("password");
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        })
        .createTable("weeks", (table) => {
            table.integer("user_id").unsigned().notNullable();
            table.integer("week_id").unsigned().notNullable();
            table
                .foreign("user_id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.primary(["week_id", "user_id"]);
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        })
        .createTable("exercises", (table) => {
            table.increments("id").primary();
            table.string("day", 9).notNullable();
            table.string("exercise").notNullable();
            table.integer("sets").unsigned().notNullable();
            table.integer("reps").unsigned().notNullable();
            table.integer("weight").unsigned().notNullable();
        })
        .createTable("week_exercise", (table) => {
            table.increments("id").primary();
            table.integer("user_id").unsigned().notNullable();
            table.integer("week_id").unsigned().notNullable();
            table.integer("exercise_id").unsigned().notNullable();
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            table
                .foreign(["week_id", "user_id"])
                .references(["week_id", "user_id"])
                .inTable("weeks")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
            table
                .foreign("exercise_id")
                .references("id")
                .inTable("exercises")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("users")
        .dropTable("weeks")
        .dropTable("exercises")
        .dropTable("week_exercise");
};
