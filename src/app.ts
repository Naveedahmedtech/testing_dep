import express from "express";
// ** configs
import logger from "./config/logger";
import { PORT, NODE_ENV } from "./config";
// ** routes
import routes from "./routes";
// ** external middlewares
import cors from "cors";
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

// ** middlewares
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFountHandler";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiterMiddleware } from "./middlewares/rateLimit";
import { ROUTES } from "./constants/routePaths";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      "https://naveed-task-manager.netlify.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(requestLogger);

app.use(
  session({
    secret: "session-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true, 
      sameSite: "lax", 
    },
  })
);


app.use(express.static("public"));

app.use(helmet());
app.use(compression());
app.use(rateLimiterMiddleware);

app.use(ROUTES.APP.VERSION_1, routes);

app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

export default app;
