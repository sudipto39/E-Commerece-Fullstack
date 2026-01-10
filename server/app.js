const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const connectDB = require("./config/db");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const AppError = require("./utils/appError");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { createAdminUser } = require("./models/adminUser");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Connect Database
connectDB();

// Global Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(helmet());              // Security headers
app.use(xss());                 // Prevent XSS attacks
app.use(mongoSanitize());       // Prevent NoSQL injection
app.use(hpp());                 // Prevent parameter pollution

// Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", limiter);

// Create default admin user
createAdminUser();

//root route
app.get("/", (req, res) => {
  res.send("ShopXpress API is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Handle unknown routes
app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
