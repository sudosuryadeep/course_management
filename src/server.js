require("dotenv").config();

const app  = require("./app");
const { connectDB } = require("./config/db");
const { PORT, NODE_ENV } = require("./config/env");



const startServer = async () => {
  try {
    await connectDB();
    console.log("✅  Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀  Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`📖  Base URL : http://localhost:${PORT}/api/v1`);
      console.log(`💓  Health   : http://localhost:${PORT}/health`);
    });

    const shutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully…`);
      server.close(() => {
        console.log("🔒  HTTP server closed.");
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT",  () => shutdown("SIGINT"));
    process.on("unhandledRejection", (reason) => {
      console.error("❌  Unhandled Promise Rejection:", reason);
      shutdown("unhandledRejection");
    });
    process.on("uncaughtException", (err) => {
      console.error("❌  Uncaught Exception:", err);
      shutdown("uncaughtException");
    });

  } catch (err) {
    console.error("❌  Failed to start server:", err);
    process.exit(1);
  }
};

startServer();