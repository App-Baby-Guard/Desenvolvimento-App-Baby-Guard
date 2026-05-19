import React from "react";
import { RoboProvider } from "./context/RoboContext";
import RootNavigator from "./routes/RootNavigator";
import Toast from "react-native-toast-message";

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