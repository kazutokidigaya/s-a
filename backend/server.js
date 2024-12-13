import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import formRoutes from "./routes/formRoutes.js";
import responseRoute from "./routes/responseRoutes.js";
import connectDb from "./config/db.js";

dotenv.config();
connectDb();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoute);

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Start the server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0"; // Bind to all interfaces for Render
  const server = app.listen(PORT, HOST, () =>
    console.log(`Server is running on port ${PORT}`)
  );

  // Set custom timeouts to avoid Render connection resets
  server.keepAliveTimeout = 120000; // 2 minutes
  server.headersTimeout = 120000; // 2 minutes
}

export { app };
