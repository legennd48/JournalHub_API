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
    this.client.on('error', (err) => {
      console.log(err);
      this.connected = false;
    });
    console.log('Redis connected successfully')
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
    const getPromise = promisify(this.client.get).bind(this.client);
    const val = getPromise(key);
    return val;
  }
  /**
   * Asynchronously sets a key-value pair in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {*} value - The value to store for the key.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<void>} Resolves when the key is set.
   */
  async setex(key, value, duration) {
    const setPromise = promisify(this.client.set).bind(this.client);
    return setPromise(key, value, 'EX', duration);
  }

}

/**
 * An instance of RedisClient.
 * @type {RedisClient}
 */
const redisClient = new RedisClient();
module.exports = redisClient;
