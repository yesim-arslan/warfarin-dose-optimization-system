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

export default function DeleteAccountScreen() {
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getDeleteErrorMessage = (error: any) => {
    if (
      error?.code === "auth/wrong-password" ||
      error?.code === "auth/invalid-credential"
    ) {
      return "Şifre hatalı. Lütfen tekrar dene.";
    }

    if (error?.code === "auth/requires-recent-login") {
      return "Güvenlik için tekrar giriş yapıp yeniden denemen gerekiyor.";
    }

    if (error?.code === "permission-denied") {
      return "Hesap verilerini silmek için Firestore izinleri yetersiz. Güvenlik kurallarını güncelledikten sonra tekrar dene.";
    }

    return error?.message ?? "Hesap silinemedi.";
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Hata", "Kullanıcı bulunamadı.");
      return;
    }

    if (!deletePassword) {
      Alert.alert("Eksik bilgi", "Hesabı silmek için şifreni gir.");
      return;
    }

    Alert.alert(
      "Hesabı sil",
      "Hesabın, profil bilgilerin, INR kayıtların ve önerilerin kalıcı olarak silinecek.",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteAccount(user, deletePassword);
              Alert.alert("Hesap silindi", "Hesabın başarıyla silindi.");
            } catch (error: any) {
              console.error(error);
              Alert.alert("Hata", getDeleteErrorMessage(error));
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
        <Text style={styles.backButtonText}>← Profil Bilgilerine Dön</Text>
      </TouchableOpacity>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Hesabı Sil</Text>
        <Text style={styles.dangerText}>
          Bu işlem geri alınamaz. Hesabınla birlikte kayıtlı INR verilerin ve doz önerilerin silinir.
        </Text>

        <Text style={styles.label}>Şifre</Text>
        <TextInput
          style={styles.input}
          value={deletePassword}
          onChangeText={setDeletePassword}
          placeholder="Şifreni gir"
          placeholderTextColor={colors.mutedText}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.deleteButton, isDeleting && styles.disabledButton]}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? "Siliniyor..." : "Hesabımı Sil"}
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
