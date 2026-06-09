import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors);

  const getLoginErrorMessage = (error: any) => {
    if (
      error?.code === "auth/invalid-credential" ||
      error?.code === "auth/user-not-found"
    ) {
      return t("loginNotFound");
    }

    if (error?.code === "auth/wrong-password") {
      return t("loginWrongPassword");
    }

    if (error?.code === "auth/invalid-email") {
      return t("loginInvalidEmail");
    }

    if (error?.code === "auth/too-many-requests") {
      return t("loginTooMany");
    }

    return t("loginFailed");
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert(t("ok"), t("loginSuccess"));
    } catch (e: any) {
      Alert.alert(t("error"), getLoginErrorMessage(e));
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("login")}</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder={t("email")}
        placeholderTextColor={colors.mutedText}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder={t("password")}
        placeholderTextColor={colors.mutedText}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t("login")}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("MedicalConsent")}>
        <Text style={styles.link}>{t("noAccount")}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    title: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 16,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    button: {
      marginTop: 14,
      padding: 14,
      borderRadius: 12,
      backgroundColor: colors.button,
      alignItems: "center",
    },
    buttonText: { color: colors.buttonText, fontWeight: "600" },
    link: {
      marginTop: 16,
      textAlign: "center",
      color: colors.primary,
      fontWeight: "600",
    },
  });
