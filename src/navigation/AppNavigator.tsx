import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import MedicalConsentScreen from "../screens/MedicalConsentScreen";
import IndicationReasonScreen from "../screens/IndicationReasonScreen";
import HomeScreen from "../screens/HomeScreen";
import { subscribeAuth } from "../services/auth";
import { User } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import UserProfileScreen from "../screens/UserProfileScreen";
import EnterInrScreen from "../screens/EnterInrScreen";
import InrHistoryScreen from "../screens/InrHistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import AboutScreen from "../screens/AboutScreen";
import MedicalWarningsScreen from "../screens/MedicalWarningsScreen";
import FoodInteractionsScreen from "../screens/FoodInteractionsScreen";
import DrugInteractionsScreen from "../screens/DrugInteractionsScreen";
import HelpScreen from "../screens/HelpScreen";
import { useTheme } from "../theme/ThemeContext";
import { getUserProfile } from "../services/firestore";
import { UserProfile } from "../types/models";

export type RootStackParamList = {
  Login: undefined;
  MedicalConsent: undefined;
  SignUp: { acceptedMedicalConsent?: boolean } | undefined;
  IndicationReason: undefined;
  Home:
    | {
        currentInr?: number;
        targetLabel?: string;
        suggestedWeeklyDoseMg?: number;
        action?: string;
        warnings?: string[];
        nextCheck?: string;
        measuredAt?: string;
      }
    | undefined;
  UserProfile: undefined;
  EnterInr: undefined;
  InrHistory: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  About: undefined;
  MedicalWarnings: undefined;
  FoodInteractions: undefined;
  DrugInteractions: undefined;
  Help: undefined;
  DeleteAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const { colors, setMode } = useTheme();

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let isActive = true;

    if (!user) {
      setMode("light");
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        const profile = await getUserProfile(user.uid);

        if (!isActive) {
          return;
        }

        setUserProfile(profile);
        setMode(profile?.themeMode === "dark" ? "dark" : "light");
      } catch (error) {
        console.error(error);

        if (isActive) {
          setUserProfile(null);
          setMode("light");
        }
      } finally {
        if (isActive) {
          setProfileLoading(false);
        }
      }
    };

    loadUserProfile();

    return () => {
      isActive = false;
    };
  }, [setMode, user]);

  if (loading || (user && profileLoading)) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const isNewAuthUser =
    !!user &&
    !!user.metadata.creationTime &&
    user.metadata.creationTime === user.metadata.lastSignInTime;
  const shouldShowInitialIndication =
    !!user &&
    (userProfile?.requiresInitialIndication === true ||
      (isNewAuthUser && !userProfile));

  return (
    <Stack.Navigator
      initialRouteName={
        user ? (shouldShowInitialIndication ? "IndicationReason" : "Home") : "Login"
      }
      screenOptions={{ headerShown: false }}
    >
      {user ? (
        <>
          <Stack.Screen name="IndicationReason" component={IndicationReasonScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="EnterInr" component={EnterInrScreen} />
          <Stack.Screen name="InrHistory" component={InrHistoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="MedicalWarnings" component={MedicalWarningsScreen} />
          <Stack.Screen name="FoodInteractions" component={FoodInteractionsScreen} />
          <Stack.Screen name="DrugInteractions" component={DrugInteractionsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MedicalConsent" component={MedicalConsentScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
