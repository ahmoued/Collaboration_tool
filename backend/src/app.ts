import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { authenticate } from "./middleware/auth.js";
import docRoutes from "./routes/documents.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev server
      "http://localhost:8080",
      "http://192.168.1.150:8080", // Vite dev server
      "http://127.0.0.1:5173", // Alternative localhost
      // Add your production domain here
    ],
    credentials: true, // Allow cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/docs", docRoutes);
app.use("/users", userRoutes);
app.get("/profile", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", user: (req as any).user });
});

export default app

