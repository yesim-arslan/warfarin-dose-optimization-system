// src/algorithms/warnings.ts
import { WarningCode, WarningSeverity } from "./types";

export const WARNING_META: Record<WarningCode, { severity: WarningSeverity; title: string }> = {
  "U-1": { severity: "danger", title: "INR çok düşük – pıhtılaşma riski" },
  "U-2": { severity: "warning", title: "INR düşük – doz artırımı gerekebilir" },
  "U-3": { severity: "warning", title: "INR yüksek – doz atlama/azaltma" },
  "U-4": { severity: "danger", title: "INR çok yüksek – ilacı durdurma" },
  "U-5": { severity: "danger", title: "Acil durum kanama uyarısı" },
  "U-6": { severity: "info", title: "Beslenme uyarısı (K vitamini)" },
  "U-7": { severity: "info", title: "Beslenme uyarısı (K vitamini)" },
  "U-8": { severity: "info", title: "İlaç kullanım talimatı" },
  "U-9": { severity: "info", title: "Kontrol zamanı" },
  "U-10": { severity: "info", title: "Tıbbi işlem öncesi uyarı" },
  "U-11": { severity: "info", title: "Warfarin kartı/Not uyarısı" },
  "U-12": { severity: "info", title: "Doz unutma yönetimi" },
};

export const GENERAL_WARNINGS: WarningCode[] = ["U-8", "U-10", "U-11", "U-12"];

export function renderWarningMessage(code: WarningCode, params: {
  nextCheckInDays?: number;
  planText?: string; // UI’de günlük planı metne çevirmek istersen
}): string {
  switch (code) {
    case "U-1":
      return "INR değeriniz çok düşük, cilt altı iğne kullanmanız gerekebilir, hemen doktorunuza başvurun."; // :contentReference[oaicite:7]{index=7}
    case "U-2":
      return params.planText
        ? `INR değeriniz olması gerekenden düşük, ilaç dozu artırılmalı; ilacınızı şu düzende kullanın:\n${params.planText}`
        : "INR değeriniz olması gerekenden düşük, ilaç dozu artırılmalı; yeni düzende kullanın."; // :contentReference[oaicite:8]{index=8}
    case "U-3":
      return "INR değeriniz yüksek; doktorunuzun önerdiği şekilde doz atlama/azaltma uygulanmalı ve tekrar INR tetkiki yapılmalı."; // :contentReference[oaicite:9]{index=9}
    case "U-4":
      return "INR değeriniz çok yüksek; ilacı durdurun ve belirtilen gün sonra tekrar INR tetkiki yaptırın."; // :contentReference[oaicite:10]{index=10}
    case "U-5":
      return "Kusma ile kanama, siyah dışkılama, idrardan kanama, aşırı burun/dişeti kanaması, geniş morarma, yeni şiddetli baş ağrısı gibi bulgulardan biri varsa hemen acile başvurun veya doktorunuza ulaşın."; // :contentReference[oaicite:11]{index=11}
    case "U-6":
      return "Bir süre K vitamininden zengin olan gıdaları bol tüketiniz."; // :contentReference[oaicite:12]{index=12}
    case "U-7":
      return "Bir süre K vitamininden zengin olan gıdaları tüketmeyiniz."; // :contentReference[oaicite:13]{index=13}
    case "U-8":
      return "İlacınızı her gün aynı saatte ve belirtilen dozda, tercihen akşam, aç veya tok olarak bir bardak su ile alınız."; // :contentReference[oaicite:14]{index=14}
    case "U-9":
      return params.nextCheckInDays != null
        ? `Bir sonraki INR tahlilini ${params.nextCheckInDays} gün sonra yaptırınız.`
        : "Bir sonraki INR tahlilini belirtilen zamanda yaptırınız."; // :contentReference[oaicite:15]{index=15}
    case "U-10":
      return "Size yeni bir ilaç veya girişimsel işlem önerilirse doktorunuza Warfarin kullandığınızı söylemeyi unutmayın."; // :contentReference[oaicite:16]{index=16}
    case "U-11":
      return "Acil durumlar için cüzdanınızda Warfarin kullandığınızı belirten bir not bulundurun."; // :contentReference[oaicite:17]{index=17}
    case "U-12":
      return "İlacınızı unuttuysanız: aynı gün hatırlarsanız alın; ertesi gün hatırlarsanız çift doz almayın, mevcut gün dozunu alarak düzene devam edin."; // :contentReference[oaicite:18]{index=18}
  }
}