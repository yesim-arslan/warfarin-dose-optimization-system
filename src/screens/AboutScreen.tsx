import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";
import { useLanguage } from "../i18n/LanguageContext";

export default function AboutScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const styles = createStyles(colors);
  const isEnglish = language === "en";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          requestHomeMenuOpen();
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>{t("back")}</Text>
      </Pressable>

      <Text style={styles.title}>{t("about")}</Text>

      <View style={styles.card}>
        <Text style={styles.appName}>
          Personalized INR Monitoring & Warfarin Dose Optimization System
        </Text>
        <Text style={styles.metaText}>
          {isEnglish ? "Developer" : "Geliştirici"}: Yeşim Arslan
        </Text>

        <Text style={styles.paragraph}>
          {isEnglish
            ? "This application was developed to help individuals using Warfarin track their INR values, view previous INR records, and follow weekly dose plans in an organized way."
            : "Bu uygulama, Warfarin kullanan bireylerin INR değerlerini takip etmelerine, geçmiş INR kayıtlarını görüntülemelerine ve haftalık doz planlarını düzenli şekilde izlemelerine yardımcı olmak amacıyla geliştirilmiştir."}
        </Text>

        <Text style={styles.paragraph}>
          {isEnglish
            ? "Dose recommendations and warnings in the application are intended only for information and decision support. This application does not replace physician examination, medical diagnosis, or professional healthcare."
            : "Uygulama içerisindeki doz önerileri ve uyarılar yalnızca bilgilendirme ve karar desteği amacı taşır. Bu uygulama doktor muayenesinin, tıbbi teşhisin veya profesyonel sağlık hizmetinin yerine geçmez."}
        </Text>

        <Text style={styles.paragraph}>
          {isEnglish
            ? "If your INR values are at unexpected levels or you do not feel well, contact your doctor or the nearest healthcare institution."
            : "INR değerleriniz beklenmeyen seviyelerdeyse veya kendinizi iyi hissetmiyorsanız doktorunuza ya da en yakın sağlık kuruluşuna başvurunuz."}
        </Text>
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
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 18,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
    },
    appName: {
      color: colors.primary,
      fontSize: 18,
      lineHeight: 25,
      fontWeight: "800",
      marginBottom: 12,
    },
    metaText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "700",
      marginBottom: 16,
    },
    paragraph: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 12,
    },
  });
