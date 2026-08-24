/**
 * Biometric WebAuthn / Passkey Authentication Engine for AuraScore (mivaj.com)
 * Supports Face ID, Touch ID, Windows Hello, and Android Biometrics
 */

export interface BiometricAuthResult {
  success: boolean;
  credentialId?: string;
  error?: string;
}

export const biometricAuthEngine = {
  /**
   * Check if the device hardware supports WebAuthn Platform Authenticator
   */
  async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return false;
    }
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  },

  /**
   * Register a new Biometric Passkey credential for the user
   */
  async registerPasskey(username: string): Promise<BiometricAuthResult> {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return { success: false, error: 'WebAuthn is not supported on this browser.' };
    }

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userId = new TextEncoder().encode(username);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'AuraScore Stadium',
          id: window.location.hostname || 'mivaj.com',
        },
        user: {
          id: userId,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      };

      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential;

      if (credential) {
        return { success: true, credentialId: credential.id };
      }
      return { success: false, error: 'Failed to generate passkey credential.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Passkey registration cancelled.' };
    }
  },

  /**
   * Authenticate an existing user via Face ID / Touch ID
   */
  async authenticatePasskey(username: string): Promise<BiometricAuthResult> {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return { success: false, error: 'WebAuthn is not supported.' };
    }

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        rpId: window.location.hostname || 'mivaj.com',
        userVerification: 'required',
      };

      const assertion = (await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential;

      if (assertion) {
        return { success: true, credentialId: assertion.id };
      }
      return { success: false, error: 'Biometric verification failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Biometric challenge dismissed.' };
    }
  },
};
