require("dotenv").config();

module.exports = {
  PORT:      process.env.PORT      || 5000,
  NODE_ENV:  process.env.NODE_ENV  || "development",
  JWT_SECRET: process.env.JWT_SECRET || "change_this_secret_in_production",

  DB_HOST:     process.env.DB_HOST     || "localhost",
  DB_PORT:     process.env.DB_PORT     || 3306,
  DB_NAME:     process.env.DB_NAME     || "course_management",
  DB_USER:     process.env.DB_USER     || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "root123",
};