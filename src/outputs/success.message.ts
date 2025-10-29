/**
 * Represents a success message object.
 * @class
 */
export class SuccessMessage {
	/**
	 * Creates an instance of SuccessMessage that directly returns a JSON object.
	 * @param {string} message - The success message.
	 * @returns {{ success: string }} - The success message in JSON format.
	 */
	constructor(message: string) {
		return { success: message };
	}
}
