import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getWarningMessageCatalog,
  WarningLevel,
} from "../algorithms/warningMessages";
import { AppThemeColors, ThemeMode, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";
import { useLanguage } from "../i18n/LanguageContext";

const levelInfoTr: Record<
  WarningLevel,
  {
    label: string;
    description: string;
  }
> = {
  critical: {
    label: "Kırmızı Uyarı",
    description:
      "Acil veya kritik durum anlamına gelir. Doktorunuza hemen ulaşmanız ya da acil servise başvurmanız gerekebilir.",
  },
  danger: {
    label: "Turuncu Uyarı",
    description:
      "Kanama veya belirgin doz riski açısından dikkat gerektirir. Ekrandaki öneriyi dikkatle izleyin ve belirtileri takip edin.",
  },
  warning: {
    label: "Sarı Uyarı",
    description:
      "INR hedef aralığın dışında olabilir. Doz, beslenme veya kontrol zamanı açısından dikkatli olunmalıdır.",
  },
  info: {
    label: "Mavi Bilgilendirme",
    description:
      "İlaç kullanımı, kontrol zamanı veya günlük takip için bilgilendirici hatırlatmadır.",
  },
};

const levelInfoEn: typeof levelInfoTr = {
  critical: {
    label: "Red Warning",
    description:
      "Indicates an urgent or critical situation. You may need to contact your doctor immediately or go to emergency care.",
  },
  danger: {
    label: "Orange Warning",
    description:
      "Requires attention for bleeding or significant dose risk. Follow the recommendation on the screen carefully and monitor symptoms.",
  },
  warning: {
    label: "Yellow Warning",
    description:
      "INR may be outside the target range. Dose, nutrition, or control timing should be followed carefully.",
  },
  info: {
    label: "Blue Information",
    description:
      "An informational reminder for medication use, control timing, or daily tracking.",
  },
};

export default function MedicalWarningsScreen() {
  const navigation = useNavigation<any>();
  const { colors, mode } = useTheme();
  const { language, t } = useLanguage();
  const styles = createStyles(colors, mode);
  const levelInfo = language === "en" ? levelInfoEn : levelInfoTr;
  const warningMessages = getWarningMessageCatalog(language);
  const warningCodes = Object.keys(warningMessages);

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

      <Text style={styles.title}>{t("medicalWarnings")}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {language === "en" ? "Meaning of Colors" : "Renklerin Anlamı"}
        </Text>

        {(Object.keys(levelInfo) as WarningLevel[]).map((level) => (
          <View key={level} style={styles.levelRow}>
            <View style={[styles.colorDot, styles[`${level}Dot`]]} />
            <View style={styles.levelTextGroup}>
              <Text style={styles.levelTitle}>{levelInfo[level].label}</Text>
              <Text style={styles.paragraph}>
                {levelInfo[level].description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {language === "en" ? "Warning Codes" : "Uyarı Kodları"}
        </Text>
        <Text style={styles.paragraph}>
          {language === "en"
            ? "U codes represent medical attention messages shown on the screen according to the INR value and dose recommendation."
            : "U kodları, INR değerine ve doz önerisine göre ekranda gösterilen tıbbi dikkat mesajlarını ifade eder."}
        </Text>

        {warningCodes.map((code) => {
          const warning = warningMessages[code];

          return (
            <View key={code} style={styles.warningItem}>
              <View
                style={[
                  styles.codeBadge,
                  styles[`${warning.level}Badge`],
                ]}
              >
                <Text style={styles.codeBadgeText}>{warning.code}</Text>
              </View>

              <View style={styles.warningTextGroup}>
                <Text style={styles.warningTitle}>{warning.title}</Text>
                <Text style={styles.warningShort}>{warning.shortText}</Text>
                <Text style={styles.paragraph}>{warning.detailText}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: AppThemeColors, mode: ThemeMode) => {
  const levelColors = {
    critical: mode === "dark" ? "#FB7185" : "#DC2626",
    danger: mode === "dark" ? "#FB923C" : "#EA580C",
    warning: mode === "dark" ? "#FACC15" : "#D97706",
    info: mode === "dark" ? "#38BDF8" : "#0284C7",
  };

  return StyleSheet.create({
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
      marginBottom: 16,
    },
    cardTitle: {
      color: colors.primary,
      fontSize: 19,
      fontWeight: "800",
      marginBottom: 12,
    },
    levelRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 14,
    },
    colorDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginTop: 3,
      marginRight: 10,
    },
    criticalDot: {
      backgroundColor: levelColors.critical,
    },
    dangerDot: {
      backgroundColor: levelColors.danger,
    },
    warningDot: {
      backgroundColor: levelColors.warning,
    },
    infoDot: {
      backgroundColor: levelColors.info,
    },
    levelTextGroup: {
      flex: 1,
    },
    levelTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      marginBottom: 3,
    },
    paragraph: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 21,
    },
    warningItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 14,
      marginTop: 14,
    },
    codeBadge: {
      minWidth: 46,
      borderRadius: 8,
      paddingVertical: 7,
      paddingHorizontal: 8,
      alignItems: "center",
      marginRight: 12,
    },
    criticalBadge: {
      backgroundColor: levelColors.critical,
    },
    dangerBadge: {
      backgroundColor: levelColors.danger,
    },
    warningBadge: {
      backgroundColor: levelColors.warning,
    },
    infoBadge: {
      backgroundColor: levelColors.info,
    },
    codeBadgeText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "900",
    },
    warningTextGroup: {
      flex: 1,
    },
    warningTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 4,
    },
    warningShort: {
      color: colors.primary,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      marginBottom: 6,
    },
  });
};
