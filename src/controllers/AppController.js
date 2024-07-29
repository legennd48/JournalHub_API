import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Retrieves the status of Redis and MongoDB connections.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   */
  async getStatus(req, res) {
    const data = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).json(data);
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
        entries: await dbClient.allEntries()
      };
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching statistics.' });
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
      const userEntries = await dbClient.allUserEntries(user_id);
      res.status(200).json({ userId: user_id, user_entries: userEntries });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching user entries.' });
    }
  }
}

export default new AppController();
