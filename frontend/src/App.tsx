import React from "react";
import Toast from "react-native-toast-message";
import { RoboProvider } from "./context/RoboContext";
import RootNavigator from "./routes/RootNavigator";

export default function App() {
  return (
    <>
      <RoboProvider>
        <RootNavigator />
      </RoboProvider>
      <Toast />
    </>
  );
}