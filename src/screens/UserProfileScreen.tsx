import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../services/firebase";
import { updateUserProfile } from "../services/firestore";
import { TherapyIndication } from "../types/models";
import { useNavigation } from "@react-navigation/native";

export default function UserProfileScreen() {
  const [indication, setIndication] = useState<TherapyIndication | "">("");
  const [weeklyDose, setWeeklyDose] = useState("");
  const navigation = useNavigation<any>();

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Hata", "Kullanıcı bulunamadı.");
      return;
    }

    if (!indication) {
      Alert.alert("Eksik bilgi", "Lütfen kullanım nedenini gir.");
      return;
    }

    if (!weeklyDose || isNaN(Number(weeklyDose))) {
      Alert.alert("Eksik bilgi", "Lütfen geçerli bir haftalık doz gir.");
      return;
    }

    try {
      await updateUserProfile(user.uid, {
        indication,
        currentWeeklyDoseMg: Number(weeklyDose),
      });

      Alert.alert("Başarılı", "Profil kaydedildi.", [
        {
            text: "Tamam",
            onPress: () => navigation.goBack(),
        },
    ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Profil kaydedilemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>

      <Text style={styles.label}>Kullanım Nedeni</Text>
      <TextInput
        style={styles.input}
        value={indication}
        onChangeText={(text) => setIndication(text as TherapyIndication)}
        placeholder="AF_OR_STROKE"
      />

      <Text style={styles.label}>Haftalık Toplam Doz (mg)</Text>
      <TextInput
        style={styles.input}
        value={weeklyDose}
        onChangeText={setWeeklyDose}
        placeholder="35"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "black",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});