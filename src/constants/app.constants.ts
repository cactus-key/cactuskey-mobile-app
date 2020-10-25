export class AppConstants {

    static WEBSITE_URL = "https://github.com/cactus-key";

    // LIMITS
    // Maximum OTPAuth URI size is 2048 bytes. An attempt to store larger values may fail.
    // see https://docs.expo.io/versions/latest/sdk/securestore/
    static MAX_SECRET_LENGTH = 1600;
    static MAX_LABEL_LENGTH = 128;
    static MAX_ISSUER_NAME_LENGTH = 128;
    static SECRET_REGEX = /^[1-9A-Z]+=*$/i;

}