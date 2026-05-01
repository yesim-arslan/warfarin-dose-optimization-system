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

export default function EnterInrScreen() {
  const navigation = useNavigation<any>();

  // Başlangıç değeri
  const [selectedInr, setSelectedInr] = useState("2.5");

  // 0.8 - 8.0 arası 0.1 artışlı INR listesi
  const inrOptions = useMemo(() => {
    const values: string[] = [];
    for (let value = 0.8; value <= 8.0 + 0.0001; value += 0.1) {
      values.push(value.toFixed(1));
    }
    return values;
  }, []);

  const handleContinue = () => {
    const inrValue = parseFloat(selectedInr);

    if (isNaN(inrValue)) {
      Alert.alert("Hata", "Lütfen geçerli bir INR değeri seç.");
      return;
    }

    const result = calculateDose({
      indication: "af_stroke", // şimdilik sabit
      currentInr: inrValue,
      weeklyDoseMg: 35, // şimdilik sabit
    });

    navigation.navigate("Home", {
      currentInr: inrValue,
      targetLabel: result.targetLabel,
      suggestedWeeklyDoseMg: result.suggestedWeeklyDoseMg,
      action: result.action,
      warnings: result.warnings,
      nextCheck: result.nextCheck,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INR Girişi</Text>
      <Text style={styles.label}>Yeni INR Değeri</Text>

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

      <Text style={styles.selectedText}>Seçilen INR: {selectedInr}</Text>

      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Hesapla</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#2f5f73",
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: "#374151",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
  picker: {
    height: 220,
    width: "100%",
  },
  pickerItem: {
    fontSize: 22,
    color: "#2f5f73",
  },
  selectedText: {
    marginTop: 14,
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});