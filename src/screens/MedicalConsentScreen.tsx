import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "MedicalConsent">;

const urgentItems = [
  "Şiddetli veya beklenmeyen kanama",
  "Kusma ile kan gelmesi",
  "Siyah renkli dışkılama",
  "İdrarda kan görülmesi",
  "Şiddetli baş ağrısı veya bilinç değişikliği",
  "INR sonucunuzun kritik seviyelerde olması",
];

const consentItems = [
  "Sunulan bilgilerin yalnızca destek amaçlı olduğunu",
  "Nihai tedavi kararının sağlık profesyonellerine ait olduğunu",
  "Acil durumlarda uygulamaya değil sağlık kuruluşlarına başvurmanız gerektiğini",
];

export default function MedicalConsentScreen({ navigation }: Props) {
  const { colors, mode } = useTheme();
  const styles = createStyles(colors, mode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tıbbi Bilgilendirme ve Kullanım Onayı</Text>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Bu uygulama, Warfarin kullanan hastaların INR sonuçlarını takip
          etmelerine ve klinik rehberlere dayalı doz planlamalarını
          görüntülemelerine yardımcı olmak amacıyla geliştirilmiştir.
        </Text>
        <Text style={styles.paragraph}>
          Uygulama tarafından sunulan bilgiler ve doz önerileri yalnızca
          bilgilendirme ve karar desteği amaçlıdır; doktor değerlendirmesinin
          yerine geçmez.
        </Text>
        <Text style={styles.paragraph}>
          Tedavi kararları, ilaç değişiklikleri ve doz düzenlemeleri yalnızca
          doktorunuz veya sizi takip eden sağlık profesyoneli tarafından
          verilmelidir.
        </Text>
      </View>

      <View style={styles.alertSection}>
        <Text style={styles.sectionTitle}>
          Aşağıdaki durumlarda derhal doktorunuza veya en yakın sağlık
          kuruluşuna başvurunuz:
        </Text>
        {urgentItems.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bu uygulamayı kullanarak:</Text>
        {consentItems.map((item) => (
          <View key={item} style={styles.checkRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.projectNote}>
        Bu uygulama TÜBİTAK 2209-B destekli bir akademik proje kapsamında
        geliştirilmiştir. Klinik karar desteği sağlamayı amaçlar ancak sağlık
        profesyoneli değerlendirmesinin yerine geçmez.
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.acceptButton}
          onPress={() =>
            navigation.navigate("SignUp", { acceptedMedicalConsent: true })
          }
        >
          <Text style={styles.acceptButtonText}>Kabul Ediyorum</Text>
        </Pressable>

        <Pressable
          style={styles.rejectButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.rejectButtonText}>Kabul Etmiyorum</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: AppThemeColors, mode: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 22,
      backgroundColor: colors.background,
    },
    title: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: "800",
      lineHeight: 30,
      marginBottom: 18,
      textAlign: "center",
    },
    section: {
      marginBottom: 16,
    },
    alertSection: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: mode === "dark" ? "#FB7185" : "#E0A3A3",
      borderRadius: 8,
      padding: 14,
      backgroundColor: mode === "dark" ? "#4A1F28" : "#FFF1F1",
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 22,
      marginBottom: 8,
    },
    paragraph: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 10,
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 6,
    },
    checkRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 8,
    },
    bullet: {
      width: 22,
      color: mode === "dark" ? "#FDA4AF" : "#A61B1B",
      fontSize: 18,
      lineHeight: 22,
      fontWeight: "700",
    },
    check: {
      width: 24,
      color: colors.primary,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
    },
    bulletText: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    projectNote: {
      color: colors.mutedText,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 2,
      marginBottom: 18,
      textAlign: "center",
    },
    actions: {
      gap: 10,
      paddingBottom: 12,
    },
    acceptButton: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    acceptButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: "700",
    },
    rejectButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    rejectButtonText: {
      color: colors.mutedText,
      fontSize: 16,
      fontWeight: "700",
    },
  });
