const redis = require('redis');
const { promisify } = require('util');

/**
 * A class to manage a Redis client connection and operations.
 */
class RedisClient {
  /**
   * Creates a new Redis client instance and connects to the Redis server.
   * Logs any connection errors to the console.
   */
  constructor() {
    this.client = redis.createClient();

    // Bind event handlers
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
      this.connected = false;
    });

    this.client.on('end', () => {
      console.log('Redis client disconnected');
      this.connected = false;
    });

    console.log('Redis connected successfully');
    this.connected = true;
  }

  /**
   * Checks if the Redis client is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Asynchronously retrieves the value associated with a given key from Redis.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} Resolves with the retrieved value or null on error.
   */
  async get(key) {
    if (!this.connected) {
      throw new Error('Redis client is not connected');
    }

    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      const value = await getAsync(key);
      return value;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  /**
   * Asynchronously sets a key-value pair in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {*} value - The value to store for the key.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<void>} Resolves when the key is set.
   */
  async setex(key, value, duration) {
    if (!this.connected) {
      throw new Error('Redis client is not connected');
    }

    const setexAsync = promisify(this.client.setex).bind(this.client);
    try {
      await setexAsync(key, duration, value);
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  /**
   * Properly closes the Redis client connection.
   */
  close() {
    if (this.connected) {
      this.client.quit();
    }
  }
}

/**
 * An instance of RedisClient.
 * @type {RedisClient}
 */
const redisClient = new RedisClient();

// Ensure the client is properly closed on application exit
process.on('exit', () => {
  redisClient.close();
});

module.exports = redisClient;
