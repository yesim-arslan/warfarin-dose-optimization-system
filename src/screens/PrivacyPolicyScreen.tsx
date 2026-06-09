import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";
import { useLanguage } from "../i18n/LanguageContext";

const sectionsTr = [
  {
    title: "1. TOPLANAN VERİLER",
    body: [
      "Uygulama, kullanıcılara INR takibi ve Warfarin doz yönetimi konusunda destek sağlamak amacıyla aşağıdaki verileri toplayabilir:",
      "• E-posta adresi\n• Kullanıcı kimlik bilgisi (UID)\n• İlaç kullanım nedeni\n• Hedef INR aralığı\n• Güncel INR değeri\n• Haftalık ilaç dozu\n• Tablet dozu bilgisi\n• INR giriş tarihi\n• Uygulama içi profil bilgileri",
      "Bu veriler yalnızca uygulamanın temel işlevlerini yerine getirebilmesi amacıyla kullanılmaktadır.",
    ],
  },
  {
    title: "2. VERİLERİN KULLANIM AMACI",
    body: [
      "Toplanan veriler aşağıdaki amaçlarla kullanılabilir:",
      "• Kullanıcı hesabı oluşturmak ve oturum yönetimini sağlamak\n• Kullanıcının INR değerlerini kaydetmek\n• Kullanıcının hedef INR aralığına göre doz önerisi oluşturmak\n• Haftalık doz takvimi oluşturmak\n• Kritik INR değerlerinde güvenlik uyarıları göstermek\n• Kullanıcının geçmiş INR kayıtlarını görüntülemesini sağlamak\n• Uygulamanın güvenliğini ve performansını sürdürmek",
      "Uygulama, kullanıcı verilerini reklam veya pazarlama amacıyla kullanmaz.",
    ],
  },
  {
    title: "3. SAĞLIK VERİLERİ VE TIBBİ SORUMLULUK REDDİ",
    body: [
      "Bu uygulama, Warfarin kullanan bireylerin INR değerlerini takip etmelerine yardımcı olmak amacıyla geliştirilmiştir.",
      "Uygulama tarafından sunulan doz önerileri ve uyarılar yalnızca bilgilendirme ve karar desteği amacı taşımaktadır.",
      "Uygulama:\n\n• Doktor muayenesinin yerine geçmez.\n• Tıbbi teşhis koymaz.\n• Kesin tedavi önerisi sunmaz.\n• Acil durumlarda profesyonel sağlık hizmetinin yerine kullanılamaz.",
      "INR değeriniz beklenmeyen seviyelerdeyse veya kanama, morarma, nefes darlığı, şiddetli baş ağrısı, dışkıda ya da idrarda kan gibi belirtileriniz varsa derhal doktorunuza veya en yakın sağlık kuruluşuna başvurunuz.",
    ],
  },
  {
    title: "4. VERİLERİN SAKLANMASI",
    body: [
      "Kullanıcı verileri uygulamanın çalışabilmesi için gerekli olduğu sürece güvenli şekilde saklanmaktadır.",
      "Uygulama aşağıdaki servisleri kullanabilir:\n\n• Firebase Authentication\n• Cloud Firestore",
      "Bu servisler kullanıcı hesabı oluşturma, kimlik doğrulama ve veri saklama işlemlerini gerçekleştirmek amacıyla kullanılmaktadır.",
    ],
  },
  {
    title: "5. VERİLERİN PAYLAŞILMASI",
    body: [
      "Kullanıcı verileri kullanıcının açık izni olmaksızın üçüncü kişilerle paylaşılmaz.",
      "Ancak aşağıdaki durumlarda paylaşım yapılabilir:\n\n• Yasal yükümlülüklerin yerine getirilmesi gerektiğinde\n• Kullanıcının açık onayı bulunduğunda\n• Uygulamanın çalışması için gerekli teknik servis sağlayıcılarla sınırlı şekilde\n• Güvenlik ve sistem bütünlüğünü sağlamak amacıyla",
      "Kullanıcı verileri reklam şirketlerine satılmaz veya pazarlama amacıyla paylaşılmaz.",
    ],
  },
  {
    title: "6. VERİ GÜVENLİĞİ",
    body: [
      "Kullanıcı verilerinin güvenliğini sağlamak amacıyla makul teknik ve idari önlemler alınmaktadır.",
      "Bu kapsamda:\n\n• Kimlik doğrulama sistemleri kullanılmaktadır.\n• Yetkisiz erişime karşı koruma sağlanmaktadır.\n• Verilere erişim sınırlandırılmaktadır.\n• Veriler yalnızca gerekli amaçlar doğrultusunda işlenmektedir.",
      "Bununla birlikte internet üzerinden yapılan veri iletimlerinin tamamen güvenli olduğu garanti edilemez.",
    ],
  },
  {
    title: "7. KULLANICI HAKLARI",
    body: [
      "Kullanıcılar aşağıdaki haklara sahiptir:",
      "• Hangi verilerinin işlendiğini öğrenme\n• Hatalı verilerin düzeltilmesini talep etme\n• Hesaplarının silinmesini isteme\n• Verilerinin silinmesini talep etme\n• Veri işleme faaliyetleri hakkında bilgi alma",
    ],
  },
  {
    title: "8. ÇOCUKLARIN GİZLİLİĞİ",
    body: [
      "Bu uygulama çocuklara yönelik olarak geliştirilmemiştir.",
      "18 yaşından küçük bireylerin uygulamayı ebeveyn, yasal vasi veya sağlık profesyoneli gözetiminde kullanmaları önerilmektedir.",
    ],
  },
  {
    title: "9. ÜÇÜNCÜ TARAF HİZMETLER",
    body: [
      "Uygulama aşağıdaki üçüncü taraf hizmetlerden yararlanabilir:",
      "• Firebase Authentication\n• Cloud Firestore\n• Firebase altyapı hizmetleri",
      "Bu hizmetlerin kendi gizlilik politikaları geçerlidir.",
    ],
  },
  {
    title: "10. POLİTİKA DEĞİŞİKLİKLERİ",
    body: [
      "Bu Gizlilik Politikası gerektiğinde güncellenebilir.",
      "Güncellenen sürüm uygulama içerisinde veya uygulamanın yayın sayfasında yayımlandığı tarihten itibaren geçerli olacaktır.",
    ],
  },
  {
    title: "11. İLETİŞİM",
    body: [
      "Bu Gizlilik Politikası hakkında sorularınız için aşağıdaki iletişim adresinden bize ulaşabilirsiniz:",
      "Geliştirici: Yeşim Arslan\nE-posta: yesim.arslan01@gmail.com\nProje: Personalized INR Monitoring & Warfarin Dose Optimization System",
      "Bu uygulamayı kullanarak yukarıda belirtilen şartları kabul etmiş sayılırsınız.",
    ],
  },
];

const sectionsEn = [
  {
    title: "1. DATA COLLECTED",
    body: [
      "The application may collect the following data to support users with INR tracking and Warfarin dose management:",
      "• Email address\n• User identity information (UID)\n• Medication usage reason\n• Target INR range\n• Current INR value\n• Weekly medication dose\n• Tablet dose information\n• INR entry date\n• In-app profile information",
      "This data is used only to provide the core functions of the application.",
    ],
  },
  {
    title: "2. PURPOSE OF DATA USE",
    body: [
      "Collected data may be used for the following purposes:",
      "• Creating user accounts and managing sessions\n• Saving users' INR values\n• Creating dose recommendations according to the user's target INR range\n• Creating a weekly dose schedule\n• Showing safety warnings for critical INR values\n• Allowing users to view previous INR records\n• Maintaining application security and performance",
      "The application does not use user data for advertising or marketing purposes.",
    ],
  },
  {
    title: "3. HEALTH DATA AND MEDICAL DISCLAIMER",
    body: [
      "This application was developed to help individuals using Warfarin track their INR values.",
      "Dose recommendations and warnings provided by the application are intended only for information and decision support.",
      "The application:\n\n• Does not replace physician examination.\n• Does not provide a medical diagnosis.\n• Does not provide a definitive treatment recommendation.\n• Cannot be used instead of professional healthcare in emergencies.",
      "If your INR value is at an unexpected level, or if you have symptoms such as bleeding, bruising, shortness of breath, severe headache, or blood in stool or urine, contact your doctor or the nearest healthcare institution immediately.",
    ],
  },
  {
    title: "4. DATA STORAGE",
    body: [
      "User data is stored securely for as long as required for the application to function.",
      "The application may use the following services:\n\n• Firebase Authentication\n• Cloud Firestore",
      "These services are used to create user accounts, authenticate users, and store data.",
    ],
  },
  {
    title: "5. DATA SHARING",
    body: [
      "User data is not shared with third parties without the user's explicit consent.",
      "However, sharing may occur in the following situations:\n\n• When required to fulfill legal obligations\n• When the user gives explicit consent\n• In a limited way with technical service providers required for app functionality\n• To maintain security and system integrity",
      "User data is not sold to advertising companies or shared for marketing purposes.",
    ],
  },
  {
    title: "6. DATA SECURITY",
    body: [
      "Reasonable technical and administrative measures are taken to ensure the security of user data.",
      "Within this scope:\n\n• Authentication systems are used.\n• Protection against unauthorized access is provided.\n• Access to data is limited.\n• Data is processed only for necessary purposes.",
      "However, it cannot be guaranteed that data transmissions over the internet are completely secure.",
    ],
  },
  {
    title: "7. USER RIGHTS",
    body: [
      "Users have the following rights:",
      "• To learn which data is processed\n• To request correction of inaccurate data\n• To request deletion of their accounts\n• To request deletion of their data\n• To receive information about data processing activities",
    ],
  },
  {
    title: "8. CHILDREN'S PRIVACY",
    body: [
      "This application was not developed specifically for children.",
      "Individuals under 18 are recommended to use the application under the supervision of a parent, legal guardian, or healthcare professional.",
    ],
  },
  {
    title: "9. THIRD-PARTY SERVICES",
    body: [
      "The application may use the following third-party services:",
      "• Firebase Authentication\n• Cloud Firestore\n• Firebase infrastructure services",
      "These services have their own privacy policies.",
    ],
  },
  {
    title: "10. POLICY CHANGES",
    body: [
      "This Privacy Policy may be updated when necessary.",
      "The updated version becomes effective from the date it is published in the application or on the application's publishing page.",
    ],
  },
  {
    title: "11. CONTACT",
    body: [
      "For questions about this Privacy Policy, you can contact us through the address below:",
      "Developer: Yeşim Arslan\nEmail: yesim.arslan01@gmail.com\nProject: Personalized INR Monitoring & Warfarin Dose Optimization System",
      "By using this application, you are deemed to have accepted the terms stated above.",
    ],
  },
];

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const styles = createStyles(colors);
  const isEnglish = language === "en";
  const sections = isEnglish ? sectionsEn : sectionsTr;

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

      <Text style={styles.title}>{t("privacyPolicy")}</Text>

      <View style={styles.card}>
        <Text style={styles.metaText}>
          {isEnglish ? "Last Updated" : "Son Güncelleme"}: 06.06.2026
        </Text>
        <Text style={styles.metaText}>
          {isEnglish ? "Application Name" : "Uygulama Adı"}: Personalized INR
          Monitoring & Warfarin Dose Optimization System
        </Text>
        <Text style={styles.metaText}>
          {isEnglish ? "Developer" : "Geliştirici"}: Yeşim Arslan
        </Text>

        <Text style={styles.paragraph}>
          {isEnglish
            ? "This Privacy Policy explains how the mobile application Personalized INR Monitoring & Warfarin Dose Optimization System collects, uses, stores, and protects user data."
            : "Bu Gizlilik Politikası, Personalized INR Monitoring & Warfarin Dose Optimization System adlı mobil uygulamanın kullanıcı verilerini nasıl topladığını, kullandığını, sakladığını ve koruduğunu açıklamak amacıyla hazırlanmıştır."}
        </Text>

        <Text style={styles.paragraph}>
          {isEnglish
            ? "By using the application, you accept the data processing terms stated in this Privacy Policy."
            : "Uygulamayı kullanarak bu Gizlilik Politikası'nda belirtilen veri işleme koşullarını kabul etmiş olursunuz."}
        </Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.body.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
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
    metaText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "700",
      marginBottom: 8,
    },
    section: {
      marginTop: 18,
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 8,
    },
    paragraph: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 12,
    },
  });
