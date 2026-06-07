import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";

const sections = [
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

export default function PrivacyPolicyScreen() {
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

      <Text style={styles.title}>Gizlilik Politikası</Text>

      <View style={styles.card}>
        <Text style={styles.metaText}>Son Güncelleme: 06.06.2026</Text>
        <Text style={styles.metaText}>
          Uygulama Adı: Personalized INR Monitoring & Warfarin Dose Optimization
          System
        </Text>
        <Text style={styles.metaText}>Geliştirici: Yeşim Arslan</Text>

        <Text style={styles.paragraph}>
          Bu Gizlilik Politikası, Personalized INR Monitoring & Warfarin Dose
          Optimization System adlı mobil uygulamanın kullanıcı verilerini nasıl
          topladığını, kullandığını, sakladığını ve koruduğunu açıklamak
          amacıyla hazırlanmıştır.
        </Text>

        <Text style={styles.paragraph}>
          Uygulamayı kullanarak bu Gizlilik Politikası'nda belirtilen veri
          işleme koşullarını kabul etmiş olursunuz.
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
