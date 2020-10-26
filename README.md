# CactusKey app
CactusKey is an open-source app, created in react native with expo (cross-platform Android & iOS), in order to manage OTP auth tokens (two-factor authentication).

## Start development server
1. Install expo command line tools:  
`npm install --global expo-cli`
2. Install packages:  
`yarn` or `npm install`
3. Start local server:  
`expo start`

## Documentation
Expo: https://docs.expo.io/  
UI kitten: https://akveo.github.io/react-native-ui-kitten/docs/guides/  
Icons: https://icons.expo.fyi/

## Contributing
Thank you for considering contributing to CactusKey! Fell free to submit pull-requests with your fixes and new features.

### Contribute new issuer
To contribute a new issuer name and icon, submit a pull-request with:
1. Issuer icon (100x100, png or jpg) into `src/issuers/` folder
2. Issuer info into `ISSUERS` array (`src/constants/issuers.constants.ts`), with displayed `name`, `key` (given into QR code), and `icon` filename.

## Build for Android
1. Increment `android.versionCode` into `app.json`
2. Run `expo build:android -t app-bundle`