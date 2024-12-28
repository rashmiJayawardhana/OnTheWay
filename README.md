# OnTheWay
A transportation mobile application built with React Native, designed to provide users with seamless authentication, item navigation, and interactive features.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


## Features

# Core Features

* Authentication
  * Secure sign-up and sign-in using Clerk.
  * Google OAuth integration.

* Flight Information
  * Real-time flight data fetched from OpenSky API.
  * Flight details include origin, altitude, speed, and status (in-flight or on-ground).

* Pagination and Navigation
  * Smooth navigation using expo-router.
  * Pagination support for viewing large datasets efficiently.

* Custom UI Components
  * Tailwind CSS styling for responsive and modern design.
  * Reusable components like InputField and CustomButton.
  
* Data Management
  * State management with Zustand.
  * Secure token storage using Expo SecureStore.

* Database
  * PostgreSQL database integration for user data storage.
  * Neon serverless for scalable and reliable database access.


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

