// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require("dotenv").config();
const { SQLUSER, SQLPW } = process.env;

module.exports = {
    development: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            user: SQLUSER,
            password: SQLPW,
            database: "portfolio_workout_tracker",
            charset: "utf8",
        },
    },

    // staging: {
    //     client: "postgresql",
    //     connection: {
    //         database: "my_db",
    //         user: "username",
    //         password: "password",
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10,
    //     },
    //     migrations: {
    //         tableName: "knex_migrations",
    //     },
    // },

    // production: {
    //     client: "postgresql",
    //     connection: {
    //         database: "my_db",
    //         user: "username",
    //         password: "password",
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10,
    //     },
    //     migrations: {
    //         tableName: "knex_migrations",
    //     },
    // },
};
