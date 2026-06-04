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

export function getWarningMessages(warnings?: string[]) {
  if (!warnings || warnings.length === 0) {
    return [];
  }

  return warnings
    .map((code) => WARNING_MESSAGES[code])
    .filter(Boolean);
}