# OnTheWay
A full-stack React Native application for flight tracking and travel management. Built with React Native, Expo, PostgreSQL, Zustand, Clerk for authentication, and styled using Tailwind CSS. Includes seamless authentication, real-time data, and a user-friendly interface for an enhanced travel experience. 🌍✈️

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


# Features

* Authentication
  * Secure user authentication using Clerk.
  * Google OAuth integration for easy access.

* Flight Information
  * Real-time flight data fetched from AviationStack API.
  * Detailed flight information, including airline, flight status, departure, and arrival details.

* Search and Filtering
  * Advanced search functionality to filter flights by name, airline, or departure airport.
  * Dynamic updates to display relevant results based on user input.

* Pagination and Navigation
  * Smooth and efficient navigation powered by expo-router.
  * Pagination support for seamless browsing of large flight datasets.

* Custom UI Components
  * Modern and responsive design implemented with Tailwind CSS.
  * Reusable components like InputField and CustomButton for consistency and ease of use.
  
* State Management
  * Optimized state management using Zustand for a predictable and scalable application state.

* Data Security and Storage
  * Secure token management and storage with Expo SecureStore.

* Database Integration
  * PostgreSQL database for robust and reliable user data management.
  * Neon serverless technology for scalable and efficient database access.

* Additional Features
  * Dynamic flight images for enhanced user experience.
  * Floating action button to showcase interaction with click counters.
  * Alerts for error handling and better user communication.


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
- 

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

