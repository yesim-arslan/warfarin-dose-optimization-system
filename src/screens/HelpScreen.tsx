import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";

const helpSections = [
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

export default function HelpScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          requestHomeMenuOpen();
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>← Geri</Text>
      </Pressable>

      <Text style={styles.title}>Yardım</Text>

      <View style={styles.card}>
        <Text style={styles.introText}>
          Bu sayfa, uygulamayı adım adım kullanmanıza yardımcı olmak için
          hazırlanmıştır. Anlamadığınız bir bölüm olursa doktorunuza veya destek
          adresine danışabilirsiniz.
        </Text>

        {helpSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.paragraph}>{section.text}</Text>
          </View>
        ))}

        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>Farklı sorular için destek</Text>
          <Text style={styles.paragraph}>
            Uygulama ile ilgili farklı sorularınız için aşağıdaki e-posta
            adresinden destek alabilirsiniz.
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
