import express from "express";
import logger from "./config/logger";
import { PORT, NODE_ENV } from "./config";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

export default app;
