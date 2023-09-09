import app from "./app.js";
const port = process.env.PORT || 8000;
import { connectDB } from "./config/database.js";

// connect database
connectDB();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
