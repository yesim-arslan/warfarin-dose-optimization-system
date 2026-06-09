import React, { createContext, useContext, useMemo, useState } from "react";

export type AppLanguage = "tr" | "en";

const translations = {
  tr: {
    appDisclaimer:
      "Bu uygulama bir doktor uygulaması değildir. Doğru bilgi için doktorunuza başvurunuz.",
    ok: "Tamam",
    error: "Hata",
    missingInfo: "Eksik bilgi",
    save: "Kaydet",
    saving: "Kaydediliyor...",
    back: "← Geri",
    backHome: "← Ana Sayfaya Dön",
    backProfile: "← Profil Bilgilerine Dön",
    settings: "Ayarlar",
    appearance: "Görünüm",
    appearanceHelper: "Uygulamanın açık veya koyu temada görünmesini seç.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "Dil",
    languageHelper: "Uygulama dilini seç.",
    turkish: "Türkçe",
    english: "English",
    settingsSavedSecure:
      "Veriler Firebase üzerinde güvenli şekilde saklanmaktadır.",
    themeSaveError: "Tema tercihin kaydedilemedi. Lütfen tekrar dene.",
    languageSaveError: "Dil tercihin kaydedilemedi. Lütfen tekrar dene.",
    login: "Giriş Yap",
    email: "Email",
    password: "Şifre",
    noAccount: "Hesabın yok mu? Kayıt ol",
    loginSuccess: "Giriş başarılı",
    loginNotFound:
      "Bu bilgilerle kayıtlı bir hesap bulunamadı. Hesabın silinmiş olabilir. Devam etmek için yeni hesap oluştur.",
    loginWrongPassword: "Şifre hatalı. Lütfen şifreni kontrol edip tekrar dene.",
    loginInvalidEmail: "Lütfen geçerli bir e-posta adresi gir.",
    loginTooMany:
      "Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar dene.",
    loginFailed: "Giriş yapılamadı. Bilgilerini kontrol edip tekrar dene.",
    signUp: "Kayıt Ol",
    signUpPassword: "Şifre (min 6)",
    hasAccount: "Zaten hesabın var mı? Giriş yap",
    consentRequired: "Onay gerekli",
    consentRequiredMessage:
      "Hesap oluşturmak için tıbbi bilgilendirme ve kullanım onayını kabul etmen gerekiyor.",
    signUpSuccess: "Kayıt başarılı",
    unknownError: "Bilinmeyen hata",
    homeTitle: "INR Takip",
    homeSubtitle: "Ana Sayfa",
    selectIndicationWarning: "Lütfen INR takip nedeninizi seçiniz",
    nextControl: "Bir sonraki kontrole",
    noMeasurement: "Henüz ölçüm yok",
    controlOverdue: "Kontrol zamanı geçti",
    controlToday: "Bugün kontrol günü",
    daysLeft: "{count} Gün Kaldı",
    controlWhenInrEntered: "INR değeri girildiğinde kontrol zamanı hesaplanır",
    weeklyDoseSchedule: "Haftalık İlaç Dozu Takvimi",
    weeklyDoseDistributionPlaceholder: "Haftalık doz dağılımı burada gösterilecek",
    todayDose: "Bugünün\nDozu",
    tablet: "tablet",
    drugStop: "İLAÇ STOP",
    inrLevel: "INR Seviyesi",
    currentInr: "Güncel INR",
    inrHistoryLink: "ⓘ INR geçmişi",
    treatmentRecommendation: "Doz Planı",
    targetRange: "Hedef Aralık",
    targetPrefix: "Hedef",
    weeklyDose: "Haftalık Doz",
    action: "Aksiyon",
    warnings: "Uyarılar",
    nextCheck: "Kontrol",
    inrEntry: "INR Girişi",
    menu: "Menü",
    account: "Hesap",
    profileInfo: "Profil Bilgileri",
    referenceLists: "Referans Listeleri",
    affectingDrugs: "Etkileyen İlaçlar",
    affectingFoods: "Etkileyen Gıdalar",
    affectingDrugsTitle: "INR'yi Etkileyen İlaçlar",
    affectingFoodsTitle: "INR'yi Etkileyen Gıdalar",
    searchDrug: "İlaç ara",
    searchFood: "Gıda ara",
    drugNotFound:
      "Aradığınız ilaç bulunamadı. Detaylı bilgi için doktorunuza başvurunuz.",
    foodNotFound:
      "Aradığınız gıda bulunamadı. Detaylı bilgi için doktorunuza başvurunuz.",
    infoSecurity: "Bilgi ve Güvenlik",
    medicalWarnings: "Tıbbi Uyarılar",
    privacyPolicy: "Gizlilik Politikası",
    about: "Hakkında",
    help: "Yardım",
    treatmentDetail: "Tedavi Detayı",
    close: "Kapat",
    newInrValue: "Yeni INR Değeri",
    selectedInr: "Seçilen INR: {value}",
    calculate: "Hesapla",
    loginRequiredForInr: "INR kaydı için giriş yapmış olman gerekiyor.",
    selectValidInr: "Lütfen geçerli bir INR değeri seç.",
    selectIndicationForDose:
      "Doz hesaplamak için INR takip sebebini seçmen gerekiyor.",
    inrSaveError:
      "INR değeri kaydedilemedi. Lütfen internet bağlantını kontrol edip tekrar dene.",
    profileTitle: "Profil Bilgileri",
    indicationReason: "INR Takip Sebebi",
    indicationPlaceholder: "Takip sebebi seçilmemiş",
    weeklyTotalDose: "Haftalık Toplam Doz (mg)",
    userNotFound: "Kullanıcı bulunamadı.",
    enterReason: "Lütfen kullanım nedenini gir.",
    enterValidWeeklyDose: "Lütfen geçerli bir haftalık doz gir.",
    success: "Başarılı",
    profileSaved: "Profil kaydedildi.",
    profileSaveError: "Profil kaydedilemedi.",
    signOut: "Çıkış Yap",
    deleteMyAccount: "Hesabımı Sil",
    deleteAccountTitle: "Hesabı Sil",
    deleteAccountDescription:
      "Bu işlem geri alınamaz. Hesabınla birlikte kayıtlı INR verilerin ve doz önerilerin silinir.",
    enterPassword: "Şifreni gir",
    deletePasswordMissing: "Hesabı silmek için şifreni gir.",
    deleteAccountConfirmMessage:
      "Hesabın, profil bilgilerin, INR kayıtların ve önerilerin kalıcı olarak silinecek.",
    cancel: "Vazgeç",
    delete: "Sil",
    deleting: "Siliniyor...",
    accountDeleted: "Hesap silindi",
    accountDeletedMessage: "Hesabın başarıyla silindi.",
    wrongDeletePassword: "Şifre hatalı. Lütfen tekrar dene.",
    recentLoginRequired:
      "Güvenlik için tekrar giriş yapıp yeniden denemen gerekiyor.",
    deletePermissionDenied:
      "Hesap verilerini silmek için Firestore izinleri yetersiz. Güvenlik kurallarını güncelledikten sonra tekrar dene.",
    historyTitle: "INR Geçmişi",
    inrChart: "INR Grafiği",
    noInrInRange: "Bu aralıkta INR kaydı yok.",
    noInrRecords: "Henüz INR kaydı bulunmuyor.",
    date: "Tarih",
    time: "Saat",
    oneDay: "1 gün",
    oneMonth: "1 ay",
    sixMonths: "6 ay",
    oneYear: "1 yıl",
    historyLoadError: "INR geçmişi yüklenemedi. Lütfen tekrar dene.",
    continue: "Devam Et",
    indicationScreenTitle: "INR Takibi\nSebebiniz",
    selectIndication: "Lütfen INR takip sebebini seç.",
    indicationSaveError: "INR takip sebebi kaydedilemedi.",
    indicationAfStroke: "Atrial fibrilasyon / inme",
    indicationSingleValve: "Tek kapak protez",
    indicationDoubleValve: "Çift kapak protez",
    indicationThrombosis: "Kalp, büyük damar veya bacak damarında pıhtı",
    notSelected: "Seçilmedi",
  },
  en: {
    appDisclaimer:
      "This app is not a doctor application. Please consult your doctor for accurate information.",
    ok: "OK",
    error: "Error",
    missingInfo: "Missing information",
    save: "Save",
    saving: "Saving...",
    back: "← Back",
    backHome: "← Back to Home",
    backProfile: "← Back to Profile",
    settings: "Settings",
    appearance: "Appearance",
    appearanceHelper: "Choose whether the app uses light or dark theme.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "Language",
    languageHelper: "Choose the app language.",
    turkish: "Turkish",
    english: "English",
    settingsSavedSecure: "Data is stored securely on Firebase.",
    themeSaveError: "Theme preference could not be saved. Please try again.",
    languageSaveError:
      "Language preference could not be saved. Please try again.",
    login: "Log In",
    email: "Email",
    password: "Password",
    noAccount: "Don't have an account? Sign up",
    loginSuccess: "Login successful",
    loginNotFound:
      "No account was found with these credentials. The account may have been deleted. Create a new account to continue.",
    loginWrongPassword: "Wrong password. Please check it and try again.",
    loginInvalidEmail: "Please enter a valid email address.",
    loginTooMany: "Too many attempts. Please wait a little and try again.",
    loginFailed: "Could not log in. Check your information and try again.",
    signUp: "Sign Up",
    signUpPassword: "Password (min 6)",
    hasAccount: "Already have an account? Log in",
    consentRequired: "Consent required",
    consentRequiredMessage:
      "You need to accept the medical information and usage consent before creating an account.",
    signUpSuccess: "Registration successful",
    unknownError: "Unknown error",
    homeTitle: "INR Tracker",
    homeSubtitle: "Home",
    selectIndicationWarning: "Please select your INR tracking reason",
    nextControl: "Next control",
    noMeasurement: "No measurement yet",
    controlOverdue: "Control time has passed",
    controlToday: "Control day is today",
    daysLeft: "{count} Days Left",
    controlWhenInrEntered: "Control time is calculated after an INR value is entered",
    weeklyDoseSchedule: "Weekly Medication Dose Schedule",
    weeklyDoseDistributionPlaceholder: "Weekly dose distribution will be shown here",
    todayDose: "Today's\nDose",
    tablet: "tablet",
    drugStop: "MEDICATION STOP",
    inrLevel: "INR Level",
    currentInr: "Current INR",
    inrHistoryLink: "ⓘ INR history",
    treatmentRecommendation: "Dose Plan",
    targetRange: "Target Range",
    targetPrefix: "Target",
    weeklyDose: "Weekly Dose",
    action: "Action",
    warnings: "Warnings",
    nextCheck: "Control",
    inrEntry: "INR Entry",
    menu: "Menu",
    account: "Account",
    profileInfo: "Profile Information",
    referenceLists: "Reference Lists",
    affectingDrugs: "Affecting Drugs",
    affectingFoods: "Affecting Foods",
    affectingDrugsTitle: "Drugs Affecting INR",
    affectingFoodsTitle: "Foods Affecting INR",
    searchDrug: "Search drug",
    searchFood: "Search food",
    drugNotFound:
      "The drug you searched for was not found. Please consult your doctor for detailed information.",
    foodNotFound:
      "The food you searched for was not found. Please consult your doctor for detailed information.",
    infoSecurity: "Information and Safety",
    medicalWarnings: "Medical Warnings",
    privacyPolicy: "Privacy Policy",
    about: "About",
    help: "Help",
    treatmentDetail: "Treatment Detail",
    close: "Close",
    newInrValue: "New INR Value",
    selectedInr: "Selected INR: {value}",
    calculate: "Calculate",
    loginRequiredForInr: "You need to be logged in to save an INR record.",
    selectValidInr: "Please select a valid INR value.",
    selectIndicationForDose:
      "You need to select your INR tracking reason to calculate a dose.",
    inrSaveError:
      "INR value could not be saved. Please check your internet connection and try again.",
    profileTitle: "Profile Information",
    indicationReason: "INR Tracking Reason",
    indicationPlaceholder: "No tracking reason selected",
    weeklyTotalDose: "Weekly Total Dose (mg)",
    userNotFound: "User not found.",
    enterReason: "Please enter the usage reason.",
    enterValidWeeklyDose: "Please enter a valid weekly dose.",
    success: "Success",
    profileSaved: "Profile saved.",
    profileSaveError: "Profile could not be saved.",
    signOut: "Log Out",
    deleteMyAccount: "Delete My Account",
    deleteAccountTitle: "Delete Account",
    deleteAccountDescription:
      "This action cannot be undone. Your saved INR records and dose recommendations will be deleted with your account.",
    enterPassword: "Enter your password",
    deletePasswordMissing: "Enter your password to delete the account.",
    deleteAccountConfirmMessage:
      "Your account, profile information, INR records, and recommendations will be permanently deleted.",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    accountDeleted: "Account deleted",
    accountDeletedMessage: "Your account has been deleted successfully.",
    wrongDeletePassword: "Wrong password. Please try again.",
    recentLoginRequired:
      "For security, please log in again and try once more.",
    deletePermissionDenied:
      "Firestore permissions are not sufficient to delete account data. Update the security rules and try again.",
    historyTitle: "INR History",
    inrChart: "INR Chart",
    noInrInRange: "No INR record in this range.",
    noInrRecords: "No INR records yet.",
    date: "Date",
    time: "Time",
    oneDay: "1 day",
    oneMonth: "1 month",
    sixMonths: "6 months",
    oneYear: "1 year",
    historyLoadError: "INR history could not be loaded. Please try again.",
    continue: "Continue",
    indicationScreenTitle: "Your INR Tracking\nReason",
    selectIndication: "Please select your INR tracking reason.",
    indicationSaveError: "INR tracking reason could not be saved.",
    indicationAfStroke: "Atrial fibrillation / stroke",
    indicationSingleValve: "Single mechanical valve",
    indicationDoubleValve: "Double mechanical valve",
    indicationThrombosis: "Clot in heart, major vessel, or leg vessel",
    notSelected: "Not selected",
  },
} as const;

type TranslationKey = keyof typeof translations.tr;

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("tr");

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (
        key: TranslationKey,
        params?: Record<string, string | number>
      ) => {
        let text: string = translations[language][key] ?? translations.tr[key];

        if (params) {
          Object.entries(params).forEach(([name, replacement]) => {
            text = text.replace(`{${name}}`, String(replacement));
          });
        }

        return text;
      },
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return value;
}
