import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/firebase";
import { updateUserProfile } from "../services/firestore";
import { Indication } from "../algorithms/doseTypes";
import IndicationSelect from "../components/IndicationSelect";

export default function IndicationReasonScreen() {
  const navigation = useNavigation<any>();
  const [selectedIndication, setSelectedIndication] = useState<Indication | "">(
    ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Hata", "Kullanıcı bulunamadı.");
      return;
    }

    if (!selectedIndication) {
      Alert.alert("Eksik bilgi", "Lütfen INR takip sebebini seç.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile(user.uid, {
        indication: selectedIndication,
        requiresInitialIndication: false,
      });
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "INR takip sebebi kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INR Takibi{"\n"}Sebebiniz</Text>

      <IndicationSelect
        value={selectedIndication}
        onChange={setSelectedIndication}
        colors={{
          background: "#ffffff",
          border: "transparent",
          text: "#3F7886",
          placeholder: "#9CA3AF",
          icon: "#3F7886",
          optionBackground: "#ffffff",
          optionBorder: "rgba(255,255,255,0.55)",
        }}
      />

      <Pressable
        style={[styles.button, (!selectedIndication || isSaving) && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selectedIndication || isSaving}
      >
        <Text style={styles.buttonText}>
          {isSaving ? "Kaydediliyor..." : "Devam Et"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 34,
    backgroundColor: "#3F7886",
  },
  title: {
    color: "#ffffff",
    fontSize: 38,
    lineHeight: 45,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 64,
    textShadowColor: "rgba(0,0,0,0.22)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  button: {
    marginTop: 44,
    alignSelf: "center",
    width: "76%",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#C6DCE4",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#2F667C",
    fontSize: 18,
    fontWeight: "800",
  },
});
