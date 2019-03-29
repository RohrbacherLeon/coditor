require("dotenv").config();

module.exports = {
    app: {
        port: process.env.APP_PORT || 3000,
        mode: process.env.APP_MODE || "prod"
    },
    db: {
        host: process.env.DB_HOST || "localhost:27017",
        database: process.env.DB_DATABASE || "coditor"
    }
};