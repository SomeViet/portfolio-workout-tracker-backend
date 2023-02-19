// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require("dotenv").config();
const { SQLUSER, SQLPW, SQLHOST, SQLDATABASE } = process.env;

module.exports = {
    development: {
        client: "mysql",
        connection: {
            host: SQLHOST,
            user: SQLUSER,
            password: SQLPW,
            database: SQLDATABASE,
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
