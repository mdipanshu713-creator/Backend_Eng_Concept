
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

// Create the Express application
const app = createApp();

// Start the server
app.listen(env.port, () => {
    logger.info(`Server is running at http://localhost:${env.port}`);
});
