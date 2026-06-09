import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/firebase";
import { deleteAccount } from "../services/auth";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function DeleteAccountScreen() {
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors);

  const getDeleteErrorMessage = (error: any) => {
    if (
      error?.code === "auth/wrong-password" ||
      error?.code === "auth/invalid-credential"
    ) {
      return t("wrongDeletePassword");
    }

    if (error?.code === "auth/requires-recent-login") {
      return t("recentLoginRequired");
    }

    if (error?.code === "permission-denied") {
      return t("deletePermissionDenied");
    }

    return error?.message ?? t("deleteAccountTitle");
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(t("error"), t("userNotFound"));
      return;
    }

    if (!deletePassword) {
      Alert.alert(t("missingInfo"), t("deletePasswordMissing"));
      return;
    }

    Alert.alert(
      t("deleteAccountTitle"),
      t("deleteAccountConfirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteAccount(user, deletePassword);
              Alert.alert(t("accountDeleted"), t("accountDeletedMessage"));
            } catch (error: any) {
              console.error(error);
              Alert.alert(t("error"), getDeleteErrorMessage(error));
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{t("backProfile")}</Text>
      </TouchableOpacity>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>{t("deleteAccountTitle")}</Text>
        <Text style={styles.dangerText}>
          {t("deleteAccountDescription")}
        </Text>

        <Text style={styles.label}>{t("password")}</Text>
        <TextInput
          style={styles.input}
          value={deletePassword}
          onChangeText={setDeletePassword}
          placeholder={t("enterPassword")}
          placeholderTextColor={colors.mutedText}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.deleteButton, isDeleting && styles.disabledButton]}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? t("deleting") : t("deleteMyAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 24,
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
    dangerZone: {
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 24,
    },
    dangerTitle: {
      color: "#b91c1c",
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
    },
    dangerText: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 8,
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    deleteButton: {
      marginTop: 18,
      backgroundColor: "#b91c1c",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    deleteButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
    disabledButton: {
      opacity: 0.6,
    },
  });
