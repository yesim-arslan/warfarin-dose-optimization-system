import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { createUserProfileIfMissing } from "../services/firestore";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const acceptedMedicalConsent = route.params?.acceptedMedicalConsent === true;

  const handleSignUp = async () => {
    if (!acceptedMedicalConsent) {
      Alert.alert(
        "Onay gerekli",
        "Hesap oluşturmak için tıbbi bilgilendirme ve kullanım onayını kabul etmen gerekiyor."
      );
      navigation.navigate("MedicalConsent");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      await createUserProfileIfMissing({
        uid,
        email: cred.user.email,
    });

    

      Alert.alert("OK", "Kayıt başarılı");
    } catch (e: any) {
      Alert.alert("Hata", e?.message ?? "Bilinmeyen hata");
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

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
        placeholder="Şifre (min 6)"
        placeholderTextColor={colors.mutedText}
      />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
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
