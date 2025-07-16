import express from "express";
import dotenv from "dotenv";
import { connect } from "./db.js";
import authRoute from "./routes/Auth.js";
import postsRoute from "./routes/Posts.js";
import commentsRoute from "./routes/Comment.js";

const app = express();

dotenv.config();

//middlewares
app.use(express.json());
app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);

const PORT = process.env.PORT || 8383;
app.listen(PORT, () => {
  console.log(`Server is listening on PORT:${PORT}`);
  connect();
});
