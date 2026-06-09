import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserProfile, updateUserProfile } from "../services/firestore";
import { TherapyIndication } from "../types/models";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import IndicationSelect from "../components/IndicationSelect";
import { requestHomeMenuOpen } from "../navigation/menuReturn";
import { useLanguage } from "../i18n/LanguageContext";

export default function UserProfileScreen() {
  const [indication, setIndication] = useState<TherapyIndication | "">("");
  const [weeklyDose, setWeeklyDose] = useState("");
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);

        if (profile?.indication) {
          setIndication(profile.indication);
        }

        if (profile?.currentWeeklyDoseMg != null) {
          setWeeklyDose(String(profile.currentWeeklyDoseMg));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(t("error"), t("userNotFound"));
      return;
    }

    if (!indication) {
      Alert.alert(t("missingInfo"), t("enterReason"));
      return;
    }

    if (!weeklyDose || isNaN(Number(weeklyDose))) {
      Alert.alert(t("missingInfo"), t("enterValidWeeklyDose"));
      return;
    }

    try {
      await updateUserProfile(user.uid, {
        indication,
        currentWeeklyDoseMg: Number(weeklyDose),
        requiresInitialIndication: false,
      });

      Alert.alert(t("success"), t("profileSaved"), [
        {
            text: t("ok"),
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              }),
        },
    ]);
    } catch (error) {
      console.error(error);
      Alert.alert(t("error"), t("profileSaveError"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            requestHomeMenuOpen();
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>{t("back")}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t("profileTitle")}</Text>

        <Text style={styles.label}>{t("indicationReason")}</Text>
        <IndicationSelect
          value={indication}
          onChange={setIndication}
          placeholder={t("indicationPlaceholder")}
          colors={{
            background: colors.inputBackground,
            border: colors.border,
            text: colors.text,
            placeholder: colors.mutedText,
            icon: colors.primary,
            optionBackground: colors.surface,
            optionBorder: colors.border,
          }}
        />

        <Text style={styles.label}>{t("weeklyTotalDose")}</Text>
        <TextInput
          style={styles.input}
          value={weeklyDose}
          onChangeText={setWeeklyDose}
          placeholder="35"
          placeholderTextColor={colors.mutedText}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{t("save")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
        <Text style={styles.signOutButtonText}>{t("signOut")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteNavButton}
        onPress={() => navigation.navigate("DeleteAccount")}
      >
        <Text style={styles.deleteNavButtonText}>{t("deleteMyAccount")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "flex-start",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: colors.text,
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
    color: colors.text,
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
  button: {
    marginTop: 24,
    backgroundColor: colors.button,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    marginTop: 32,
    backgroundColor: colors.button,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteNavButton: {
    marginTop: 12,
    backgroundColor: "#b91c1c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteNavButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
