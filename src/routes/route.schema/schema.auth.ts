//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

//
/**
 * Schema for validating the body of a Beats login request.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {string} body.username - The username for login.
 * @property {string} body.password - The password for login.
 */
export const beatsLoginSchema = {
    body: t.Object({ username: t.String(), password: t.String() }),

}

/**
 * Schema for validating the authorization header with a bearer token.
 *
 * @type {Object}
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The bearer token for authorization.
 */
export const authorizationBearerSchema = { 
    headers: t.Object({ authorization: t.String() })
}

/**
 * Schema for validating the body of a user registration request.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {string} body.userName - The username for registration.
 * @property {string} body.password - The password for registration.
 */
export const registrationSchema = { 
    body: t.Object({ 
        userName: t.String(), 
        password: t.String(), 
        deviceId: t.String()
    })
}


/**
 * Schema for validating the body of a user registration request.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {string} body.userName - The username for registration.
 * @property {string} body.password - The password for registration.
 */
export const preRegistrationSchema = { 
    body: t.Object({ 
        userName: t.String(), 
        email: t.String(),
        password: t.String()
    })
}

/**
 * Schema for validating the body of a Google server token received.
 *
 * @type {Object}
 * @property {Object} body - The body of the received.
 * @property {string} body.serverToken - The server token for Google authentication.
 */
export const googleServerTokenSchema = { 
    body: t.Object({ 
        serverToken: t.String(),
        deviceId: t.String() 
    })
}


/**
 * Schema for validating the body of a Google server token received.
 *
 * @type {Object}
 * @property {Object} body - The body of the received.
 * @property {string} body.serverToken - The server token for Google authentication.
 */
export const passkeySchema = { 
    body: t.Object({ username: t.String()})
}





export const passkeyAuthVerifySchema = {
	body: t.Object({
		authenticatorAttachment: t.String(),
		clientExtensionResults: t.Object({}, { additionalProperties: true }), // Allows any structure inside the object
		deviceId: t.String(),
		id: t.String(),
		rawId: t.String(),
		response: t.Object({
			authenticatorData: t.String(),
			clientDataJSON: t.String(),
			signature: t.String(),
			userHandle: t.String(),
		}),
		type: t.String(),
		username: t.String(),
	}),
};



export const passkeyRegistrationResponseSchema = {
    body: t.Object({
        id: t.String(), // Base64URLString
        rawId: t.String(), // Base64URLString
        response: t.Object({
            clientDataJSON: t.String(),
            attestationObject: t.String(),
            transports: t.Optional(t.Array(t.String())), // Optional: array of transport methods (e.g., 'usb', 'nfc')
        }),
        authenticatorAttachment: t.Optional(t.String()), // Optional: could be 'platform' or 'cross-platform'
        clientExtensionResults: t.Object({}),
        type: t.String(), // Should be 'public-key'
    }),
    opts: t.Object({
        expectedChallenge: t.Union([
            t.String(),
            t.Function([t.String()], t.Union([t.Boolean(), t.Promise(t.Boolean())])),
        ]),
        expectedOrigin: t.Union([t.String(), t.Array(t.String())]),
        expectedRPID: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        expectedType: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        requireUserPresence: t.Optional(t.Boolean()),
        requireUserVerification: t.Optional(t.Boolean()),
        supportedAlgorithmIDs: t.Optional(t.Array(t.Number())), // COSEAlgorithmIdentifier is typically a number
    }),
};
