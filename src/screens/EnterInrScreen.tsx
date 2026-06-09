import React, { useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { calculateDose } from "../algorithms/doseCalculator";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { auth } from "../services/firebase";
import { addInrRecord, getUserProfile } from "../services/firestore";
import { useLanguage } from "../i18n/LanguageContext";

export default function EnterInrScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors);

  // Başlangıç değeri
  const [selectedInr, setSelectedInr] = useState("2.5");
  const [isSaving, setIsSaving] = useState(false);

  // 0.8 - 8.0 arası 0.1 artışlı INR listesi
  const inrOptions = useMemo(() => {
    const values: string[] = [];
    for (let value = 0.8; value <= 8.0 + 0.0001; value += 0.1) {
      values.push(value.toFixed(1));
    }
    return values;
  }, []);

  const handleContinue = async () => {
    const user = auth.currentUser;
    const inrValue = parseFloat(selectedInr);

    if (!user) {
      Alert.alert(t("error"), t("loginRequiredForInr"));
      return;
    }

    if (isNaN(inrValue)) {
      Alert.alert(t("error"), t("selectValidInr"));
      return;
    }

    try {
      setIsSaving(true);
      const measuredAt = new Date().toISOString();

      await addInrRecord({
        uid: user.uid,
        inr: inrValue,
        measuredAt,
      });

      const profile = await getUserProfile(user.uid);

      if (!profile?.indication) {
        Alert.alert(
          t("missingInfo"),
          t("selectIndicationForDose")
        );
        navigation.navigate("IndicationReason");
        return;
      }

      const result = calculateDose({
        indication: profile.indication,
        currentInr: inrValue,
        weeklyDoseMg: profile.currentWeeklyDoseMg ?? 35,
      });

      navigation.navigate("Home", {
        currentInr: inrValue,
        targetLabel: result.targetLabel,
        suggestedWeeklyDoseMg: result.suggestedWeeklyDoseMg,
        action: result.action,
        warnings: result.warnings,
        nextCheck: result.nextCheck,
        measuredAt,
      });
    } catch (error) {
      console.error(error);
      Alert.alert(
        t("error"),
        t("inrSaveError")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backButtonText}>{t("backHome")}</Text>
      </Pressable>

      <View style={styles.formContent}>
        <Text style={styles.title}>{t("inrEntry")}</Text>
        <Text style={styles.label}>{t("newInrValue")}</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedInr}
            onValueChange={(itemValue) => setSelectedInr(String(itemValue))}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {inrOptions.map((value) => (
              <Picker.Item
                key={value}
                label={value}
                value={value}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.selectedText}>
          {t("selectedInr", { value: selectedInr })}
        </Text>

        <Pressable
          style={[styles.button, isSaving && styles.disabledButton]}
          onPress={handleContinue}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? t("saving") : t("calculate")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
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
  formContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: colors.primary,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.inputBackground,
  },
  picker: {
    height: 220,
    width: "100%",
  },
  pickerItem: {
    fontSize: 22,
    color: colors.primary,
  },
  selectedText: {
    marginTop: 14,
    fontSize: 16,
    color: colors.mutedText,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.button,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
