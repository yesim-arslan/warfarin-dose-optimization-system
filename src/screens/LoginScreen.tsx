import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getLoginErrorMessage = (error: any) => {
    if (
      error?.code === "auth/invalid-credential" ||
      error?.code === "auth/user-not-found"
    ) {
      return "Bu bilgilerle kayıtlı bir hesap bulunamadı. Hesabın silinmiş olabilir. Devam etmek için yeni hesap oluştur.";
    }

    if (error?.code === "auth/wrong-password") {
      return "Şifre hatalı. Lütfen şifreni kontrol edip tekrar dene.";
    }

    if (error?.code === "auth/invalid-email") {
      return "Lütfen geçerli bir e-posta adresi gir.";
    }

    if (error?.code === "auth/too-many-requests") {
      return "Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar dene.";
    }

    return "Giriş yapılamadı. Bilgilerini kontrol edip tekrar dene.";
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("OK", "Giriş başarılı");
    } catch (e: any) {
      Alert.alert("Hata", getLoginErrorMessage(e));
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={colors.mutedText}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Şifre"
        placeholderTextColor={colors.mutedText}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("MedicalConsent")}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
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
