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

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(
  session({
    secret: "session-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(cookieParser());
app.use(express.static("public"));

app.use(helmet());
app.use(compression());

app.use("/api", routes);
app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

export default app;
