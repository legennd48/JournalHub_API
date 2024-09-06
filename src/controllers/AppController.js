import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';
import { logger } from '../middleware/logger';
import {

HTTP_STATUS_OK,
HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from '../constants/httpStatusCodes';

class AppController {
/**
 * Retrieves the status of Redis and MongoDB connections.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
getStatus(req, res) {
  const data = {
    MongoDB: dbClient.isAlive() ? 'is Live' : 'Dead',
    JourlaHub: 'OK',
  };
  logger.info(`Status retrieved successfully. Status code: ${HTTP_STATUS_OK}`);
  res.status(HTTP_STATUS_OK).json(data);
}

/**
 * Retrieves statistics about users and entries.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
async getStats(req, res) {
  try {
    const data = {
      users: await dbClient.allUsers(),
      entries: await dbClient.allEntries(),
    };
    logger.info(`Statistics retrieved successfully. Status code: ${HTTP_STATUS_OK}`);
    res.status(HTTP_STATUS_OK).json(data);
  } catch (error) {
    logger.error('An error occurred while fetching statistics.', error);
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: 'An error occurred while fetching statistics.' });
  }
}

/**
 * Retrieves the total number of entries belonging to a specific user.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
async getUserEntries(req, res) {
  try {
    const user_id = req.params.id;
    const userEntries = await dbClient.db
      .collection('journal_entries')
      .countDocuments({ author_id: ObjectId(user_id) });
    logger.info(
      `User entries retrieved successfully for user with ID: ${user_id}. Status code: ${HTTP_STATUS_OK}`
    );
    res
      .status(HTTP_STATUS_OK)
      .json({ userId: user_id, user_entries: userEntries });
  } catch (error) {
    logger.error('An error occurred while fetching user entries.', error);
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: 'An error occurred while fetching user entries.' });
  }
}

/**
 * Gets the home page of the API
 * @param {object} req The request object.
 * @param {onject} res The response object
 */
async getHome (req, res) {
  logger.info
  return res.status(HTTP_STATUS_OK).end(`Welcome To JournalHub. \nPlease refere the Documentation On how to use`)
}

}

export default new AppController();
