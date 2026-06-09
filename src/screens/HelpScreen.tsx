import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";
import { useLanguage } from "../i18n/LanguageContext";

const helpSectionsTr = [
  {
    title: "1. Uygulamaya giriş",
    text:
      "E-posta adresiniz ve şifrenizle giriş yapabilirsiniz. İlk kez kayıt oluyorsanız, önce tıbbi bilgilendirme ekranını okuyup onaylamanız gerekir.",
  },
  {
    title: "2. INR takip sebebi",
    text:
      "İlk kayıt sırasında INR takip sebebinizi seçmeniz istenir. Daha sonra bu bilgiyi Profil Bilgileri ekranından değiştirebilirsiniz.",
  },
  {
    title: "3. INR değeri girme",
    text:
      "Ana sayfadaki INR Girişi düğmesine basın. Ölçülen INR değerinizi seçin ve devam edin. Uygulama, girilen değere göre bilgilendirme ve doz desteği gösterir.",
  },
  {
    title: "4. Ana sayfadaki bilgiler",
    text:
      "Ana sayfada güncel INR değerinizi, hedef aralığı, tedavi önerisini, bir sonraki kontrol zamanını ve haftalık ilaç doz takvimini görebilirsiniz.",
  },
  {
    title: "5. INR geçmişi",
    text:
      "Güncel INR kutusundaki INR geçmişi bölümünden daha önce girdiğiniz INR değerlerini ve grafiği görebilirsiniz.",
  },
  {
    title: "6. Uyarıları anlama",
    text:
      "Ekranda kırmızı, turuncu, sarı veya mavi uyarılar çıkabilir. Bu renklerin ve U kodlarının anlamını Menü içindeki Tıbbi Uyarılar sayfasından okuyabilirsiniz.",
  },
  {
    title: "7. Gıda ve ilaç listeleri",
    text:
      "Menüdeki Etkileyen Gıdalar ve Etkileyen İlaçlar sayfalarında INR değerini etkileyebilecek örnekleri arayabilirsiniz. Detaylı bilgi için doktorunuza danışmanız önerilir.",
  },
  {
    title: "8. Profil ve ayarlar",
    text:
      "Profil Bilgileri ekranından takip sebebinizi ve haftalık doz bilginizi düzenleyebilirsiniz. Ayarlar ekranından açık veya koyu görünümü seçebilirsiniz.",
  },
];

const helpSectionsEn = [
  {
    title: "1. Log in to the app",
    text:
      "You can log in with your email address and password. If you are registering for the first time, you need to read and accept the medical information screen first.",
  },
  {
    title: "2. INR tracking reason",
    text:
      "During the first registration flow, you are asked to select your INR tracking reason. You can later change this information from the Profile Information screen.",
  },
  {
    title: "3. Entering an INR value",
    text:
      "Tap the INR Entry button on the home screen. Select your measured INR value and continue. The app shows information and dose support according to the entered value.",
  },
  {
    title: "4. Information on the home screen",
    text:
      "On the home screen, you can see your current INR value, target range, treatment recommendation, next control time, and weekly medication dose schedule.",
  },
  {
    title: "5. INR history",
    text:
      "From the INR history section in the current INR card, you can view previously entered INR values and the chart.",
  },
  {
    title: "6. Understanding warnings",
    text:
      "Red, orange, yellow, or blue warnings may appear on the screen. You can read the meaning of these colors and U codes from the Medical Warnings page in the menu.",
  },
  {
    title: "7. Food and drug lists",
    text:
      "You can search examples that may affect INR values on the Affecting Foods and Affecting Drugs pages in the menu. Consult your doctor for detailed information.",
  },
  {
    title: "8. Profile and settings",
    text:
      "You can edit your tracking reason and weekly dose information from Profile Information. You can select light/dark appearance and app language from Settings.",
  },
];

export default function HelpScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const styles = createStyles(colors);
  const isEnglish = language === "en";
  const helpSections = isEnglish ? helpSectionsEn : helpSectionsTr;

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

      <Text style={styles.title}>{t("help")}</Text>

      <View style={styles.card}>
        <Text style={styles.introText}>
          {isEnglish
            ? "This page was prepared to help you use the application step by step. If there is a section you do not understand, you can consult your doctor or the support address."
            : "Bu sayfa, uygulamayı adım adım kullanmanıza yardımcı olmak için hazırlanmıştır. Anlamadığınız bir bölüm olursa doktorunuza veya destek adresine danışabilirsiniz."}
        </Text>

        {helpSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.paragraph}>{section.text}</Text>
          </View>
        ))}

        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            {isEnglish ? "Support for other questions" : "Farklı sorular için destek"}
          </Text>
          <Text style={styles.paragraph}>
            {isEnglish
              ? "For other questions about the application, you can get support from the email address below."
              : "Uygulama ile ilgili farklı sorularınız için aşağıdaki e-posta adresinden destek alabilirsiniz."}
          </Text>
          <Text style={styles.emailText}>yesim.arslan01@gmail.com</Text>
        </View>
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
    introText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginBottom: 14,
    },
    section: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 14,
      marginTop: 14,
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 6,
    },
    paragraph: {
      color: colors.mutedText,
      fontSize: 15,
      lineHeight: 23,
    },
    supportBox: {
      marginTop: 18,
      padding: 14,
      borderRadius: 10,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    supportTitle: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 8,
    },
    emailText: {
      color: colors.primary,
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "800",
      marginTop: 8,
    },
  });
