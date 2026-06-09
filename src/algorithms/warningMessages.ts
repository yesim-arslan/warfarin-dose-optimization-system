export type WarningLevel = "info" | "warning" | "danger" | "critical";

export type WarningMessage = {
  code: string;
  level: WarningLevel;
  title: string;
  shortText: string;
  detailText: string;
};

export const WARNING_MESSAGES: Record<string, WarningMessage> = {
  "U-1": {
    code: "U-1",
    level: "critical",
    title: "Doktorunuza Başvurun",
    shortText: "INR değeriniz çok düşük. Ek iğne tedavisi gerekebilir.",
    detailText:
      "INR değeriniz çok düşük olduğu için pıhtılaşma riski artabilir. Cilt altı iğne tedavisi gerekebileceğinden doktorunuza başvurmanız önerilir.",
  },

  "U-2": {
    code: "U-2",
    level: "warning",
    title: "INR Düşük",
    shortText: "INR değeriniz hedef aralığın altında. Doz artırılmıştır.",
    detailText:
      "INR değeriniz olması gerekenden düşük. Bu nedenle haftalık ilaç dozunuz artırılmıştır. İlacınızı ekranda gösterilen yeni düzene göre kullanınız.",
  },

  "U-3": {
    code: "U-3",
    level: "danger",
    title: "INR Yüksek",
    shortText: "INR değeriniz yüksek. Kanama belirtilerine dikkat ediniz.",
    detailText:
      "INR değeriniz hedef aralığın üzerindedir. Kanama riskine karşı dikkatli olunuz ve belirtilen doz atlama/azaltma önerisini takip ediniz.",
  },

  "U-4": {
    code: "U-4",
    level: "critical",
    title: "İlaç STOP",
    shortText: "INR değeriniz çok yüksek. İlacı geçici olarak durdurunuz.",
    detailText:
      "INR değeriniz çok yüksek olduğu için ilacı geçici olarak durdurmanız gerekir. Ekranda belirtilen gün kadar bekleyip tekrar INR kontrolü yaptırınız.",
  },

  "U-5": {
    code: "U-5",
    level: "critical",
    title: "Acil Belirti Takibi",
    shortText: "Kanama belirtisi varsa acil servise başvurunuz.",
    detailText:
      "Kusma ile kan gelmesi, siyah dışkılama, idrardan kan gelmesi, burun veya diş eti kanaması, vücutta geniş morarmalar, şiddetli baş ağrısı, konuşma güçlüğü gibi belirtilerden biri varsa hemen doktorunuza ulaşınız veya acil servise başvurunuz.",
  },

  "U-6": {
    code: "U-6",
    level: "info",
    title: "Beslenme Uyarısı",
    shortText: "Bir süre K vitamininden zengin gıdaları bol tüketiniz.",
    detailText:
      "INR değeriniz yüksek olduğu için bir süre K vitamininden zengin gıdaları daha fazla tüketmeniz önerilebilir. Bu konuda doktor önerisi önemlidir.",
  },

  "U-7": {
    code: "U-7",
    level: "warning",
    title: "Beslenme Uyarısı",
    shortText: "Bir süre K vitamininden zengin gıdaları tüketmeyiniz.",
    detailText:
      "INR değeriniz düşük olduğu için K vitamininden zengin gıdalar Warfarin etkisini azaltabilir. Bu nedenle bir süre bu gıdaları azaltmanız önerilir.",
  },

  "U-8": {
    code: "U-8",
    level: "info",
    title: "İlaç Kullanım Saati",
    shortText: "İlacınızı her gün aynı saatte alınız.",
    detailText:
      "İlacınızı her gün aynı saatte ve belirtilen dozda, tercihen akşam, aç veya tok olarak bir bardak su ile alınız.",
  },

  "U-9": {
    code: "U-9",
    level: "info",
    title: "INR Kontrolü",
    shortText: "Bir sonraki INR kontrolünüzü zamanında yaptırınız.",
    detailText:
      "Bir sonraki INR tahlilini ekranda belirtilen kontrol zamanında yaptırmanız önerilir.",
  },

  "U-10": {
    code: "U-10",
    level: "info",
    title: "Doktora Bilgi Verin",
    shortText: "Yeni işlem veya ilaç öncesi Warfarin kullandığınızı söyleyin.",
    detailText:
      "Diş çekimi, ameliyat veya yeni ilaç başlanması gibi durumlarda doktorunuza Warfarin kullandığınızı mutlaka bildiriniz.",
  },

  "U-11": {
    code: "U-11",
    level: "info",
    title: "Warfarin Kartı",
    shortText: "Cüzdanınızda Warfarin kullandığınızı belirten not taşıyınız.",
    detailText:
      "Acil durumlarda sağlık personelinin bilmesi için cüzdanınızda Warfarin kullandığınızı belirten bir not veya kart bulundurmanız önerilir.",
  },

  "U-12": {
    code: "U-12",
    level: "info",
    title: "Doz Unutulursa",
    shortText: "Unutulan doz için çift doz almayınız.",
    detailText:
      "İlacınızı aynı gün içinde hatırlarsanız mevcut dozu alınız. Ertesi gün hatırlarsanız çift doz almayınız, o günün dozuyla devam ediniz.",
  },
};

const WARNING_MESSAGES_EN: Record<string, WarningMessage> = {
  "U-1": {
    code: "U-1",
    level: "critical",
    title: "Contact Your Doctor",
    shortText: "Your INR is very low. Additional injection treatment may be needed.",
    detailText:
      "Because your INR is very low, clotting risk may increase. Contact your doctor because subcutaneous injection treatment may be required.",
  },
  "U-2": {
    code: "U-2",
    level: "warning",
    title: "Low INR",
    shortText: "Your INR is below the target range. The dose has been increased.",
    detailText:
      "Your INR is lower than expected. Therefore, your weekly medication dose has been increased. Use your medication according to the new schedule shown on the screen.",
  },
  "U-3": {
    code: "U-3",
    level: "danger",
    title: "High INR",
    shortText: "Your INR is high. Watch for bleeding symptoms.",
    detailText:
      "Your INR is above the target range. Be careful about bleeding risk and follow the indicated dose skipping or dose reduction recommendation.",
  },
  "U-4": {
    code: "U-4",
    level: "critical",
    title: "Medication STOP",
    shortText: "Your INR is very high. Temporarily stop the medication.",
    detailText:
      "Because your INR is very high, you need to temporarily stop the medication. Wait for the number of days shown on the screen and have your INR checked again.",
  },
  "U-5": {
    code: "U-5",
    level: "critical",
    title: "Emergency Symptom Monitoring",
    shortText: "Go to emergency care if bleeding symptoms occur.",
    detailText:
      "If you have vomiting blood, black stools, blood in urine, nose or gum bleeding, large bruises, severe headache, speech difficulty, or similar symptoms, contact your doctor immediately or go to the emergency department.",
  },
  "U-6": {
    code: "U-6",
    level: "info",
    title: "Nutrition Warning",
    shortText: "You may need to consume more vitamin K-rich foods for a while.",
    detailText:
      "Because your INR is high, consuming more vitamin K-rich foods for a while may be recommended. Your doctor's advice is important.",
  },
  "U-7": {
    code: "U-7",
    level: "warning",
    title: "Nutrition Warning",
    shortText: "Avoid vitamin K-rich foods for a while.",
    detailText:
      "Because your INR is low, vitamin K-rich foods may reduce the effect of Warfarin. Therefore, reducing these foods for a while may be recommended.",
  },
  "U-8": {
    code: "U-8",
    level: "info",
    title: "Medication Time",
    shortText: "Take your medication at the same time every day.",
    detailText:
      "Take your medication at the same time every day and at the indicated dose, preferably in the evening, with a glass of water.",
  },
  "U-9": {
    code: "U-9",
    level: "info",
    title: "INR Control",
    shortText: "Have your next INR control on time.",
    detailText:
      "It is recommended that you have your next INR test at the control time shown on the screen.",
  },
  "U-10": {
    code: "U-10",
    level: "info",
    title: "Inform Your Doctor",
    shortText: "Tell your doctor you use Warfarin before any new procedure or medication.",
    detailText:
      "In situations such as tooth extraction, surgery, or starting a new medication, always inform your doctor that you use Warfarin.",
  },
  "U-11": {
    code: "U-11",
    level: "info",
    title: "Warfarin Card",
    shortText: "Carry a note in your wallet stating that you use Warfarin.",
    detailText:
      "It is recommended that you carry a note or card stating that you use Warfarin so healthcare personnel can know in emergencies.",
  },
  "U-12": {
    code: "U-12",
    level: "info",
    title: "Missed Dose",
    shortText: "Do not take a double dose for a missed dose.",
    detailText:
      "If you remember within the same day, take the current dose. If you remember the next day, do not take a double dose; continue with that day's dose.",
  },
};

export function getWarningMessages(warnings?: string[], language: "tr" | "en" = "tr") {
  if (!warnings || warnings.length === 0) {
    return [];
  }

  const messages = language === "en" ? WARNING_MESSAGES_EN : WARNING_MESSAGES;

  return warnings
    .map((code) => messages[code])
    .filter(Boolean);
}

export function getWarningMessageCatalog(language: "tr" | "en" = "tr") {
  return language === "en" ? WARNING_MESSAGES_EN : WARNING_MESSAGES;
}
