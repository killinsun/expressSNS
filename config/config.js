import _ from "../env";

export default {
  development: {
    username: process.env.SEQUELIZE_ID,
    password: process.env.SEQUELIZE_PWD,
    database: "nodesns",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.SEQUELIZE_ID,
    password: process.env.SEQUELIZE_PWD,
    database: "nodesns_production",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
};
