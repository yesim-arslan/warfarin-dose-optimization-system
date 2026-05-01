import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { generateWeeklySchedule } from "../algorithms/weeklySchedule";
import { getTabletVisual } from "../algorithms/tabletDisplay";


export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const currentInr = route.params?.currentInr;
  const targetLabel = route.params?.targetLabel;
  const suggestedWeeklyDoseMg = route.params?.suggestedWeeklyDoseMg;
  const action = route.params?.action;
  const warnings = route.params?.warnings;
  const nextCheck = route.params?.nextCheck;
  const weeklySchedule =
    suggestedWeeklyDoseMg != null
      ? generateWeeklySchedule(suggestedWeeklyDoseMg)
      : [];

  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const todayDoseMg = weeklySchedule?.[todayIndex]?.dose ?? 0;
  const todayVisual = getTabletVisual(todayDoseMg, 5);
  const isStopMode = typeof action === "string" && action.includes("İlaç STOP");
  const stopInfo = isStopMode
    ? action.replace("İlaç STOP,", "").trim()
    : "";

  const today = new Date();
  const dayNumber = today.toLocaleDateString("tr-TR", {
    day: "2-digit",
  });
  const monthNumber = today.toLocaleDateString("tr-TR", {
    month: "2-digit",
  });
  const dayName = today.toLocaleDateString("tr-TR", {
    weekday: "long",
  });
  const todayDayLabel = `${dayNumber}.${monthNumber} ${dayName}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>INR Takip</Text>
          <Text style={styles.headerSubtitle}>Ana Sayfa</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>İlaç Dozu Güncellemesi</Text>
            <Text style={styles.bigText}>17 Gün Kaldı</Text>
            <Text style={styles.helperText}>
              Son güncelleme bilgisi burada görünecek
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Haftalık İlaç Dozu Takvimi</Text>
            <Text style={styles.helperText}>
              Haftalık doz dağılımı burada gösterilecek
            </Text>

            <View style={styles.todayDoseBox}>
              <View style={styles.todayDoseLeft}>
                <Text style={styles.todayDate}>{todayDayLabel}</Text>
                <Text style={styles.todayTitle}>Bugünün{"\n"}Dozu</Text>
              </View>

              <View style={styles.todayDoseRight}>
                <Text style={styles.todayDoseText}>
                  {todayVisual.tabletCount} tablet | {todayVisual.mg} mg
                </Text>

                <View style={styles.tabletsRow}>
                  {todayVisual.slots.map((slot, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tabletBase,
                        slot === "full" && styles.fullTablet,
                        slot === "half" && styles.halfTablet,
                        slot === "empty" && styles.emptyTablet,
                      ]}
                    >
                      <View style={styles.tabletVerticalLine} />
                      <View style={styles.tabletHorizontalLine} />
                      {slot === "half" && <View style={styles.halfTabletCover} />}
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.dayRow}>
              {weeklySchedule.length > 0 ? (
                weeklySchedule.map((item: any, index: number) => (
                  <View key={`${item.day}-${index}`} style={styles.dayBox}>
                    <Text style={styles.dayName}>{item.day}</Text>
                    <Text style={styles.dayDose}>{item.dose}</Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Pzt</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Sal</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Çar</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Per</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Cum</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Cmt</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                  <View style={styles.dayBox}>
                    <Text style={styles.dayName}>Paz</Text>
                    <Text style={styles.dayDose}>-</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>INR Seviyesi</Text>

            <View style={styles.inrRow}>
              <View style={styles.inrBoxHalf}>
                <Text style={styles.inrLabel}>Güncel INR</Text>

                <Text style={styles.inrValue}>
                  {currentInr ? currentInr : "-"}
                </Text>

                <Text style={styles.inrStatus}>
                  {targetLabel ? `Hedef: ${targetLabel}` : "Henüz ölçüm yok"}
                </Text>
              </View>

              <View style={styles.resultBoxHalf}>
                <Text style={styles.resultTitle}>Sonuç</Text>

                {action ? (
                  <>
                    <Text style={styles.resultText}>
                      Yeni Doz: {suggestedWeeklyDoseMg} mg
                    </Text>
                    <Text style={styles.resultText}>Aksiyon: {action}</Text>
                    <Text style={styles.resultText}>
                      Uyarılar: {warnings?.join(", ") || "-"}
                    </Text>
                    <Text style={styles.resultText}>Kontrol: {nextCheck}</Text>
                  </>
                ) : (
                  <Text style={styles.resultPlaceholder}>
                    Henüz hesaplama yapılmadı
                  </Text>
                )}
              </View>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate("EnterInr")}
            >
              <Text style={styles.primaryButtonText}>INR Girişi</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("UserProfile")}
          >
            <Text style={styles.secondaryButtonText}>Profil Bilgileri</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => signOut(auth)}
          >
            <Text style={styles.secondaryButtonText}>Çıkış Yap</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  scrollContent: {
    padding: 20,
  },
  container: {
    gap: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f5f73",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2f5f73",
    marginBottom: 10,
  },
  bigText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#2f5f73",
  },
  helperText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 6,
  },
  dayBox: {
    flex: 1,
    backgroundColor: "#e8eff2",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2f5f73",
  },
  dayDose: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  inrBox: {
    backgroundColor: "#eef3f5",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  inrLabel: {
    fontSize: 18,
    color: "#2f5f73",
    marginBottom: 8,
  },
  inrValue: {
    fontSize: 42,
    fontWeight: "700",
    color: "#2f5f73",
  },
  inrStatus: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: "#d89b1d",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 14,
    backgroundColor: "#f8fafb",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d9e2e8",
  },
  inrRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  inrBoxHalf: {
    flex: 1,
    backgroundColor: "#eef3f5",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 190,
  },
  resultBoxHalf: {
    flex: 1,
    backgroundColor: "#f8fafb",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d9e2e8",
    minHeight: 190,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f5f73",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 8,
  },
  resultPlaceholder: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 10,
  },
  todayDoseBox: {
    backgroundColor: "#A9BDC8",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 132,
    borderWidth: 1.5,
    borderColor: "#3E768C",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  todayDoseLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  todayDoseRight: {
    width: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  todayDate: {
    fontSize: 15,
    color: "#3A6B80",
    marginBottom: 10,
    fontWeight: "500",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.10)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  todayTitle: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "700",
    color: "#2F667C",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  todayDoseText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3A6B80",
    marginBottom: 14,
    textShadowColor: "rgba(0,0,0,0.10)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  tabletsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  tabletBase: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,

    borderWidth: 2,
    borderColor: "#2F667C",
  },

  fullTablet: {
    backgroundColor: "#C77D1A",
  },

  halfTablet: {
    backgroundColor: "#D89B1D",
  },

  emptyTablet: {
    backgroundColor: "#F2D4A4",
  },

  halfTabletCover: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "#F2D4A4",
    zIndex: 1,
  },

  tabletVerticalLine: {
    position: "absolute",
    width: 2,
    height: "100%",
    backgroundColor: "#2F667C",
    zIndex: 2,
  },

  tabletHorizontalLine: {
    position: "absolute",
    height: 2,
    width: "100%",
    backgroundColor: "#2F667C",
    zIndex: 2,
  },
});