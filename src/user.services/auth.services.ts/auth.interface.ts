/**
 * Represents the data required for registering a user with Google.
 *
 * @interface GoogleRegister
 * @property {string} token - The Google authentication token.
 * @property {string} deviceId - The unique identifier for the device used for registration.
 */
export interface GoogleRegister {
    serverToken: string;
    deviceId: string;
}


export interface PasskeyRegistrationOptions {
    response: RegistrationResponseJSON;
    expectedChallenge: string | ((challenge: string) => boolean | Promise<boolean>);
    expectedOrigin: string | string[];
    expectedRPID?: string | string[];
    expectedType?: string | string[];
    requireUserPresence?: boolean;
    requireUserVerification?: boolean;
    supportedAlgorithmIDs?: COSEAlgorithmIdentifier[];
}

export interface RegistrationResponseJSON {
    username: string
    deviceId: string
    id: string;
    rawId: string;
    response: AuthenticatorAttestationResponseJSON;
    authenticatorAttachment?: AuthenticatorAttachment;
    clientExtensionResults: AuthenticationExtensionsClientOutputs;
    type: PublicKeyCredentialType;
}

export interface AuthenticatorAttestationResponseJSON {
    clientDataJSON: string;
    attestationObject: string;
    authenticatorData?: string;
    transports?: AuthenticatorTransportFuture[];
    publicKeyAlgorithm?: COSEAlgorithmIdentifier;
    publicKey?: string;
}


export interface WebAuthnCredential {
    id: string;
    publicKey: Uint8Array;
    counter: number;
    transports?: AuthenticatorTransportFuture[];
};

export type AuthenticatorTransportFuture = 'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb';