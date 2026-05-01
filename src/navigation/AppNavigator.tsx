import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import { subscribeAuth } from "../services/auth";
import { User } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import UserProfileScreen from "../screens/UserProfileScreen";
import EnterInrScreen from "../screens/EnterInrScreen";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home:
    | {
        currentInr?: number;
        targetLabel?: string;
        suggestedWeeklyDoseMg?: number;
        action?: string;
        warnings?: string[];
        nextCheck?: string;
      }
    | undefined;
  UserProfile: undefined;
  EnterInr: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="EnterInr" component={EnterInrScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}