import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, ThemeMode, useTheme } from "../theme/ThemeContext";
import { auth } from "../services/firebase";
import { updateUserThemeMode } from "../services/firestore";
import { requestHomeMenuOpen } from "../navigation/menuReturn";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { colors, mode, setMode } = useTheme();
  const styles = createStyles(colors);

  const options: { label: string; value: ThemeMode }[] = [
    { label: "Light Mode", value: "light" },
    { label: "Dark Mode", value: "dark" },
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
        "Hata",
        "Tema tercihin kaydedilemedi. Lütfen tekrar dene."
      );
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
        <Text style={styles.backButtonText}>← Geri</Text>
      </Pressable>

      <Text style={styles.title}>Ayarlar</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Görünüm</Text>
        <Text style={styles.helperText}>
          Uygulamanın açık veya koyu temada görünmesini seç.
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

      <Text style={styles.securityNote}>
        Veriler Firebase üzerinde güvenli şekilde saklanmaktadır.
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
