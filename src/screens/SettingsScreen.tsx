import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, ThemeMode, useTheme } from "../theme/ThemeContext";
import { auth } from "../services/firebase";
import { updateUserLanguage, updateUserThemeMode } from "../services/firestore";
import { requestHomeMenuOpen } from "../navigation/menuReturn";
import { AppLanguage, useLanguage } from "../i18n/LanguageContext";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { colors, mode, setMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const styles = createStyles(colors);

  const options: { label: string; value: ThemeMode }[] = [
    { label: t("lightMode"), value: "light" },
    { label: t("darkMode"), value: "dark" },
  ];
  const languageOptions: { label: string; value: AppLanguage }[] = [
    { label: t("turkish"), value: "tr" },
    { label: t("english"), value: "en" },
  ];

  const handleThemeChange = async (nextMode: ThemeMode) => {
    const previousMode = mode;
    const user = auth.currentUser;

    setMode(nextMode);

    if (!user) {
      return;
    }

    try {
      await updateUserThemeMode(user.uid, nextMode);
    } catch (error) {
      console.error(error);
      setMode(previousMode);
      Alert.alert(
        t("error"),
        t("themeSaveError")
      );
    }
  };

  const handleLanguageChange = async (nextLanguage: AppLanguage) => {
    const previousLanguage = language;
    const user = auth.currentUser;

    setLanguage(nextLanguage);

    if (!user) {
      return;
    }

    try {
      await updateUserLanguage(user.uid, nextLanguage);
    } catch (error) {
      console.error(error);
      setLanguage(previousLanguage);
      Alert.alert(t("error"), t("languageSaveError"));
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          requestHomeMenuOpen();
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>{t("back")}</Text>
      </Pressable>

      <Text style={styles.title}>{t("settings")}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("appearance")}</Text>
        <Text style={styles.helperText}>
          {t("appearanceHelper")}
        </Text>

        <View style={styles.segmentedControl}>
          {options.map((option) => {
            const isSelected = mode === option.value;

            return (
              <Pressable
                key={option.value}
                style={[
                  styles.segmentButton,
                  isSelected && styles.segmentButtonSelected,
                ]}
                onPress={() => handleThemeChange(option.value)}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    isSelected && styles.segmentButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("language")}</Text>
        <Text style={styles.helperText}>{t("languageHelper")}</Text>

        <View style={styles.segmentedControl}>
          {languageOptions.map((option) => {
            const isSelected = language === option.value;

            return (
              <Pressable
                key={option.value}
                style={[
                  styles.segmentButton,
                  isSelected && styles.segmentButtonSelected,
                ]}
                onPress={() => handleLanguageChange(option.value)}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    isSelected && styles.segmentButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.securityNote}>
        {t("settingsSavedSecure")}
      </Text>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    backButton: {
      alignSelf: "flex-start",
      marginBottom: 18,
      paddingVertical: 8,
      paddingRight: 10,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "700",
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
      marginBottom: 14,
    },
    securityNote: {
      marginTop: "auto",
      color: colors.mutedText,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "500",
      opacity: 0.78,
      textAlign: "center",
    },
    cardTitle: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
    },
    helperText: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 18,
    },
    segmentedControl: {
      flexDirection: "row",
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 4,
      gap: 4,
    },
    segmentButton: {
      flex: 1,
      borderRadius: 9,
      paddingVertical: 12,
      alignItems: "center",
    },
    segmentButtonSelected: {
      backgroundColor: colors.primary,
    },
    segmentButtonText: {
      color: colors.mutedText,
      fontSize: 15,
      fontWeight: "700",
    },
    segmentButtonTextSelected: {
      color: colors.primaryText,
    },
  });
