/**
 * Represents a validation error object.
 * @class
 */
export default class ValidationError extends Error {
    /**
     * The error code associated with the validation error.
     * @type {number}
     */
    code: number;
  
    /**
     * Additional details or context information about the validation error.
     * @type {string}
     */
    details: string;
  
    /**
     * Creates an instance of ValidationError.
     * @param {string} message - The error message.
     * @param {string} details - Additional details or context information about the validation error.
     */
    constructor(message: string, details: string) {
      super(message);
  
      /**
       * The error code associated with the validation error.
       * @type {number}
       */
      this.code = 422;
  
      /**
       * Additional details or context information about the validation error.
       * @type {string}
       */
      this.details = details;
    }
  
    /**
     * Converts the ValidationError object to JSON format.
     * @returns {{ error: string }} - The validation error in JSON format.
     */
    toJSON() {
      return { error: this.message };
    }
  }
  