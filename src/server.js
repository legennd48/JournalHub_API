import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import dbClient from './utils/db';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { logger } from './middleware/logger';
import path from 'path';

// Load environment variables from .env file
dotenv.config();



// Initialize the Express app
const app = express();

const port = process.env.PORT;

if (!port) {
  logger.error('PORT environment variable is not set');
  setTimeout(() => process.exit(1), 100);
}

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '../public')));

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());


// Route handling
app.use('/', routes);

// Start the server once the database is connected
dbClient.on('connected', () => {
  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
  });
});
