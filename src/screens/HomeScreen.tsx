import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { generateWeeklySchedule } from "../algorithms/weeklySchedule";
import { getTabletVisual } from "../algorithms/tabletDisplay";
import { getWarningMessages } from "../algorithms/warningMessages";
import { calculateDose } from "../algorithms/doseCalculator";
import { AppThemeColors, ThemeMode, useTheme } from "../theme/ThemeContext";
import { auth } from "../services/firebase";
import { getLatestInrRecord, getUserProfile } from "../services/firestore";
import { InrRecord, UserProfile } from "../types/models";
import { consumeHomeMenuOpenRequest } from "../navigation/menuReturn";
import { useLanguage } from "../i18n/LanguageContext";

const parseNextCheckInDays = (nextCheck?: string) => {
  if (!nextCheck) {
    return null;
  }

  const normalized = nextCheck.toLocaleLowerCase("tr-TR");
  const dayMatch = normalized.match(/(\d+)\s*gün/);
  const ordinalDayMatch = normalized.match(/(\d+)\.\s*gün/);

  if (ordinalDayMatch) {
    return Number(ordinalDayMatch[1]);
  }

  if (dayMatch) {
    return Number(dayMatch[1]);
  }

  if (normalized.includes("hafta")) {
    return 7;
  }

  if (normalized.includes("ay")) {
    return 30;
  }

  return null;
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const translateDoseText = (
  value: string | undefined,
  language: "tr" | "en"
) => {
  if (!value || language !== "en") {
    return value;
  }

  const normalized = value.toLocaleLowerCase("tr-TR");
  const dayControlMatch = normalized.match(/(\d+)\.\s*gün\s*[iı]nr kontrolü/);
  const dayAfterMatch = normalized.match(/(\d+)\s*gün sonra/);
  const waitDaysMatch = normalized.match(/(\d+)\s*gün bekle/);

  if (normalized === "ayni doz devam" || normalized === "aynı doz devam") {
    return "Continue same dose";
  }

  if (normalized.includes("1 ay sonra")) {
    return "1 month later";
  }

  if (normalized.includes("1 hafta sonra")) {
    return "1 week later";
  }

  if (dayControlMatch) {
    return `INR control on day ${dayControlMatch[1]}`;
  }

  if (dayAfterMatch) {
    return `${dayAfterMatch[1]} days later`;
  }

  if (waitDaysMatch) {
    return `Wait ${waitDaysMatch[1]} days`;
  }

  if (normalized.includes("ilaç stop")) {
    return value
      .replace(/İlaç STOP/gi, "Medication STOP")
      .replace(/(\d+)\s*gün bekle/gi, "Wait $1 days")
      .replace(/sonra haftalık toplam dozu azaltarak devam et/gi, "then continue with a reduced weekly total dose");
  }

  if (normalized.includes("haftalık toplam doz artırılmalı")) {
    return normalized.includes("iğne tedavisi")
      ? "Weekly total dose should be increased and distributed across the week; injection treatment may be needed"
      : "Weekly total dose should be increased and distributed across the week";
  }

  if (normalized.includes("haftalık toplam doz azaltılmalı")) {
    return "Weekly total dose should be reduced and distributed across the week";
  }

  if (normalized.includes("1 gün doz atla")) {
    return "Skip 1 dose day, then continue with a reduced weekly total dose";
  }

  return value;
};

const getControlCountdownLabel = (
  measuredAt?: string,
  nextCheck?: string,
  t?: (key: any, params?: Record<string, string | number>) => string
) => {
  const nextCheckInDays = parseNextCheckInDays(nextCheck);

  if (!measuredAt || nextCheckInDays == null) {
    return t ? t("noMeasurement") : "Henüz ölçüm yok";
  }

  const measuredDate = new Date(measuredAt);

  if (Number.isNaN(measuredDate.getTime())) {
    return t ? t("noMeasurement") : "Henüz ölçüm yok";
  }

  const controlDate = startOfDay(addDays(measuredDate, nextCheckInDays));
  const today = startOfDay(new Date());
  const remainingDays = Math.ceil(
    (controlDate.getTime() - today.getTime()) / 86400000
  );

  if (remainingDays < 0) {
    return t ? t("controlOverdue") : "Kontrol zamanı geçti";
  }

  if (remainingDays === 0) {
    return t ? t("controlToday") : "Bugün kontrol günü";
  }

  return t ? t("daysLeft", { count: remainingDays }) : `${remainingDays} Gün Kaldı`;
};

type MenuIconType =
  | "profile"
  | "settings"
  | "food"
  | "drug"
  | "warning"
  | "privacy"
  | "about"
  | "help";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, mode } = useTheme();
  const { language, t } = useLanguage();
  const styles = createStyles(colors, mode);

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuProgress = useRef(new Animated.Value(0)).current;
  const [latestInrRecord, setLatestInrRecord] = useState<InrRecord | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const openMenu = () => {
    setMenuVisible(true);
    setMenuOpen(true);
    Animated.timing(menuProgress, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = (afterClose?: () => void) => {
    Animated.timing(menuProgress, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      setMenuOpen(false);
      setMenuVisible(false);
      afterClose?.();
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (consumeHomeMenuOpenRequest() && !menuOpen) {
        requestAnimationFrame(openMenu);
      }

      return undefined;
    }, [menuOpen])
  );

  const menuPanelAnimatedStyle = {
    opacity: menuProgress,
    transform: [
      {
        translateX: menuProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [36, 0],
        }),
      },
    ],
  };

  const renderMenuIcon = (type: MenuIconType) => {
    if (type === "profile") {
      return (
        <View style={styles.menuActionIconFrame}>
          <View style={styles.profileIconHead} />
          <View style={styles.profileIconBody} />
        </View>
      );
    }

    if (type === "settings") {
      return (
        <View style={styles.menuActionIconFrame}>
          <Text style={styles.gearIconText}>⚙︎</Text>
        </View>
      );
    }

    if (type === "drug") {
      return (
        <View style={styles.menuActionIconFrame}>
          <View style={styles.pillIcon}>
            <View style={styles.pillDivider} />
          </View>
        </View>
      );
    }

    if (type === "privacy") {
      return (
        <View style={styles.menuActionIconFrame}>
          <View style={styles.lockIconShackle} />
          <View style={styles.lockIconBody} />
        </View>
      );
    }

    if (type === "warning") {
      return (
        <View style={styles.menuActionIconFrame}>
          <View style={styles.circleIcon}>
            <Text style={styles.menuSymbolText}>!</Text>
          </View>
        </View>
      );
    }

    if (type === "food") {
      return (
        <View style={styles.menuActionIconFrame}>
          <View style={styles.foodIconCircle}>
            <View style={styles.foodIconLeaf} />
          </View>
        </View>
      );
    }

    if (type === "about") {
      return (
        <View style={styles.menuActionIconFrame}>
          <View style={styles.circleIcon}>
            <Text style={styles.menuSymbolText}>i</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.menuActionIconFrame}>
        <View style={styles.circleIcon}>
          <Text style={styles.menuSymbolText}>?</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    let isActive = true;
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const loadHomeData = async () => {
      try {
        const [record, profile] = await Promise.all([
          route.params?.currentInr != null
            ? Promise.resolve(null)
            : getLatestInrRecord(user.uid),
          getUserProfile(user.uid),
        ]);

        if (isActive) {
          setUserProfile(profile);

          if (record) {
            setLatestInrRecord(record);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadHomeData();

    return () => {
      isActive = false;
    };
  }, [route.params?.currentInr]);

  const currentInr = route.params?.currentInr ?? latestInrRecord?.inr;
  const savedDoseResult = useMemo(() => {
    if (
      route.params?.currentInr != null ||
      currentInr == null ||
      !userProfile?.indication
    ) {
      return null;
    }

    return calculateDose({
      indication: userProfile.indication,
      currentInr,
      weeklyDoseMg: userProfile?.currentWeeklyDoseMg ?? 35,
    });
  }, [
    currentInr,
    route.params?.currentInr,
    userProfile?.currentWeeklyDoseMg,
    userProfile?.indication,
  ]);

  const targetLabel = route.params?.targetLabel ?? savedDoseResult?.targetLabel;
  const inrStatusLabel = targetLabel
    ? `${t("targetPrefix")}: ${targetLabel}`
    : currentInr != null
      ? t("selectIndicationWarning")
      : t("noMeasurement");
  const suggestedWeeklyDoseMg =
    route.params?.suggestedWeeklyDoseMg ??
    savedDoseResult?.suggestedWeeklyDoseMg;
  const action = route.params?.action ?? savedDoseResult?.action;
  const warnings = route.params?.warnings ?? savedDoseResult?.warnings;
  const warningMessages = getWarningMessages(warnings, language);
  const highestWarning =
    warningMessages.find((w) => w.level === "critical") ||
    warningMessages.find((w) => w.level === "danger") ||
    warningMessages.find((w) => w.level === "warning") ||
    warningMessages.find((w) => w.level === "info");
  const nextCheck = route.params?.nextCheck ?? savedDoseResult?.nextCheck;
  const displayedNextCheck = translateDoseText(nextCheck, language);
  const displayedAction = translateDoseText(action, language);
  const measuredAt = route.params?.measuredAt ?? latestInrRecord?.measuredAt;
  const controlCountdownLabel = getControlCountdownLabel(measuredAt, nextCheck, t);
  const weeklySchedule =
    suggestedWeeklyDoseMg != null
      ? generateWeeklySchedule(suggestedWeeklyDoseMg)
      : [];
  const dayLabels =
    language === "en"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const localizedWeeklySchedule = weeklySchedule.map((item, index) => ({
    ...item,
    day: dayLabels[index] ?? item.day,
  }));

  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const todayDoseMg = weeklySchedule?.[todayIndex]?.dose ?? 0;
  const todayVisual = getTabletVisual(todayDoseMg, 5);
  const isStopMode =
    typeof action === "string" &&
    (action.includes("İlaç STOP") || action.includes("bırakın"));
  const stopInfo = isStopMode
    ? action
        .replace("İlaç STOP,", "")
        .replace("İlacı", "")
        .replace("boyunca bırakın", "bekleyin")
        .trim()
    : "";

  const today = new Date();
  const dayNumber = today.toLocaleDateString("tr-TR", {
    day: "2-digit",
  });
  const monthNumber = today.toLocaleDateString("tr-TR", {
    month: "2-digit",
  });
  const dayName = today.toLocaleDateString(language === "en" ? "en-US" : "tr-TR", {
    weekday: "long",
  });
  const todayDayLabel = `${dayNumber}.${monthNumber} ${dayName}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t("homeTitle")}</Text>

            <Pressable
              style={styles.menuButton}
              onPress={() => (menuOpen ? closeMenu() : openMenu())}
            >
              <View
                style={[
                  styles.menuLine,
                  menuOpen && styles.menuLineOpen,
                ]}
              />
              <View
                style={[
                  styles.menuLine,
                  menuOpen && styles.menuLineOpen,
                ]}
              />
              <View
                style={[
                  styles.menuLine,
                  menuOpen && styles.menuLineOpen,
                ]}
              />
            </Pressable>
          </View>
          <Text style={styles.headerSubtitle}>{t("homeSubtitle")}</Text>
          {highestWarning && (
            <View
              style={[
                styles.warningBanner,
                highestWarning.level === "critical" &&
                  styles.warningBannerCritical,
                highestWarning.level === "danger" &&
                  styles.warningBannerDanger,
                highestWarning.level === "warning" &&
                  styles.warningBannerWarning,
                highestWarning.level === "info" &&
                  styles.warningBannerInfo,
              ]}
            >
              <View style={styles.warningHeader}>
                <Text style={styles.warningIcon}>⚠️</Text>

                <Text style={styles.warningTitle}>
                  {highestWarning.title}
                </Text>
              </View>

              <Text style={styles.warningText}>
                {highestWarning.shortText}
              </Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("nextControl")}</Text>
            <Text style={styles.bigText}>{controlCountdownLabel}</Text>
            <Text style={styles.helperText}>
              {nextCheck
                ? `${t("nextCheck")}: ${displayedNextCheck}`
                : t("controlWhenInrEntered")}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("weeklyDoseSchedule")}</Text>
            <Text style={styles.helperText}>
              {t("weeklyDoseDistributionPlaceholder")}
            </Text>

            <View style={[styles.todayDoseBox, isStopMode && styles.todayDoseBoxStop]}>
              {isStopMode ? (
                <View style={styles.stopDoseContent}>
                  <Text style={[styles.todayDate, styles.todayDateStop]}>
                    {todayDayLabel}
                  </Text>
                  <View style={styles.stopTextGroup}>
                    <Text style={styles.stopTitle}>{t("drugStop")}</Text>
                    <Text style={styles.stopInfo}>{translateDoseText(stopInfo, language)}</Text>
                    <Text style={styles.stopCheck}>{displayedNextCheck}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.todayDoseLeft}>
                    <Text style={styles.todayDate}>{todayDayLabel}</Text>
                    <Text style={styles.todayTitle}>{t("todayDose")}</Text>
                  </View>

                  <View style={styles.todayDoseRight}>
                    <Text style={styles.todayDoseText}>
                      {todayVisual.tabletCount} {t("tablet")} | {todayVisual.mg} mg
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
                </>
              )}
            </View>

            <View style={styles.dayRow}>
              {localizedWeeklySchedule.length > 0 ? (
                localizedWeeklySchedule.map((item: any, index: number) => (
                  <View key={`${item.day}-${index}`} style={styles.dayBox}>
                    <Text style={styles.dayName}>{item.day}</Text>
                    <Text style={styles.dayDose}>{item.dose}</Text>
                    <Text style={styles.dayDoseUnit}>mg</Text>
                  </View>
                ))
              ) : (
                <>
                  {dayLabels.map((dayLabel) => (
                  <View key={dayLabel} style={styles.dayBox}>
                    <Text style={styles.dayName}>{dayLabel}</Text>
                    <Text style={styles.dayDose}>-</Text>
                    <Text style={styles.dayDoseUnit}>mg</Text>
                  </View>
                  ))}
                </>
              )}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("inrLevel")}</Text>

            <View style={styles.inrRow}>
              <View style={styles.inrBoxHalf}>
                <Text style={styles.inrLabel}>{t("currentInr")}</Text>

                <Text style={styles.inrValue}>
                  {currentInr ? currentInr : "-"}
                </Text>

                <Text style={styles.inrStatus}>
                  {inrStatusLabel}
                </Text>

                <Pressable
                  style={styles.inrHistoryLink}
                  onPress={() => navigation.navigate("InrHistory")}
                >
                  <Text style={styles.inrHistoryLinkText}>
                    {t("inrHistoryLink")}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.resultBoxHalf}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {t("treatmentRecommendation")}
                  </Text>

                  <Pressable
                    style={styles.infoButton}
                    onPress={() => setInfoModalVisible(true)}
                  >
                    <Text style={styles.infoIcon}>ⓘ</Text>
                  </Pressable>
                </View>

                {action ? (
                  <>
                    <Text style={styles.resultLabel}>
                      {t("weeklyDose")}
                    </Text>

                    <Text style={styles.resultDose}>
                      {suggestedWeeklyDoseMg} mg
                    </Text>

                    <Text style={styles.resultLabel}>
                      {t("nextCheck")}
                    </Text>

                    <Text style={styles.resultCheck}>
                      {displayedNextCheck}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.resultPlaceholder}>
                    {t("noMeasurement")}
                  </Text>
                )}
              </View>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate("EnterInr")}
            >
              <Text style={styles.primaryButtonText}>{t("inrEntry")}</Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
      {menuVisible && (
        <>
          <Pressable
            style={styles.menuDismissArea}
            onPress={() => closeMenu()}
          />

          <Animated.View style={[styles.menuPanel, menuPanelAnimatedStyle]}>
            <View style={styles.menuPanelHeader}>
              <Text style={styles.menuTitle}>{t("menu")}</Text>
            </View>

            <ScrollView
              style={styles.menuActionsScroll}
              contentContainerStyle={styles.menuActions}
            >
              <Text style={styles.menuSectionLabel}>{t("account")}</Text>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("UserProfile"));
                }}
              >
                {renderMenuIcon("profile")}
                <Text style={styles.menuActionText}>{t("profileInfo")}</Text>
              </Pressable>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("Settings"));
                }}
              >
                {renderMenuIcon("settings")}
                <Text style={styles.menuActionText}>{t("settings")}</Text>
              </Pressable>

              <Text style={styles.menuSectionLabel}>{t("referenceLists")}</Text>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("DrugInteractions"));
                }}
              >
                {renderMenuIcon("drug")}
                <Text style={styles.menuActionText}>{t("affectingDrugs")}</Text>
              </Pressable>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("FoodInteractions"));
                }}
              >
                {renderMenuIcon("food")}
                <Text style={styles.menuActionText}>{t("affectingFoods")}</Text>
              </Pressable>

              <Text style={styles.menuSectionLabel}>{t("infoSecurity")}</Text>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("MedicalWarnings"));
                }}
              >
                {renderMenuIcon("warning")}
                <Text style={styles.menuActionText}>{t("medicalWarnings")}</Text>
              </Pressable>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("PrivacyPolicy"));
                }}
              >
                {renderMenuIcon("privacy")}
                <Text style={styles.menuActionText}>{t("privacyPolicy")}</Text>
              </Pressable>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("About"));
                }}
              >
                {renderMenuIcon("about")}
                <Text style={styles.menuActionText}>{t("about")}</Text>
              </Pressable>

              <Pressable
                style={styles.menuActionButton}
                onPress={() => {
                  closeMenu(() => navigation.navigate("Help"));
                }}
              >
                {renderMenuIcon("help")}
                <Text style={styles.menuActionText}>{t("help")}</Text>
              </Pressable>
            </ScrollView>
          </Animated.View>

          <Pressable
            style={styles.menuButtonFloating}
            onPress={() => closeMenu()}
          >
            <View style={[styles.menuLine, styles.menuLineOpen]} />
            <View style={[styles.menuLine, styles.menuLineOpen]} />
            <View style={[styles.menuLine, styles.menuLineOpen]} />
          </Pressable>
        </>
      )}
    <Modal
      visible={infoModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setInfoModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("treatmentDetail")}</Text>

          <Text style={styles.modalText}>
            {t("weeklyDose")}: {suggestedWeeklyDoseMg} mg
          </Text>

          <Text style={styles.modalText}>
            {t("action")}: {displayedAction}
          </Text>

          <Text style={styles.modalText}>
            {t("warnings")}: {warnings?.join(", ") || "-"}
          </Text>

          <Text style={styles.modalText}>
            {t("nextCheck")}: {displayedNextCheck}
          </Text>

          <Pressable
            style={styles.modalButton}
            onPress={() => setInfoModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>{t("close")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppThemeColors, mode: ThemeMode) => {
  const inrButtonOrange = "#d89b1d";
  const emptyTabletColor = mode === "dark" ? "#F4F8F9" : "#F2D4A4";
  const todayDoseBlue = "#A9BDC8";
  const todayDoseTextBlue = "#2F667C";
  const menuPanelBackground = mode === "dark" ? todayDoseBlue : colors.primary;
  const menuPanelText = mode === "dark" ? todayDoseTextBlue : "#ffffff";
  const menuSectionText =
    mode === "dark" ? "rgba(47,102,124,0.78)" : "rgba(255,255,255,0.78)";
  const menuActionTextColor = mode === "dark" ? "#EAF2F6" : colors.primary;

  return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  container: {
    gap: 12,
  },
  headerRow: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 8,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 8,
  },
  menuButtonFloating: {
    position: "absolute",
    top: 28,
    right: 20,
    zIndex: 30,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  menuLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  menuLineOpen: {
    backgroundColor: menuPanelText,
  },
  menuDismissArea: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 15,
  },
  menuPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "78%",
    zIndex: 20,
    backgroundColor: menuPanelBackground,
    paddingHorizontal: 24,
    paddingTop: 28,
    borderTopLeftRadius: 36,
    borderBottomLeftRadius: 36,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: -6, height: 0 },
    elevation: 10,
  },
  menuPanelHeader: {
    minHeight: 52,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingRight: 56,
  },
  menuTitle: {
    color: menuPanelText,
    fontSize: 34,
    fontWeight: "700",
  },
  menuActionsScroll: {
    marginTop: 26,
  },
  menuActions: {
    paddingBottom: 34,
    gap: 12,
  },
  menuSectionLabel: {
    color: menuSectionText,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  menuActionButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuActionIconFrame: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileIconHead: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: menuActionTextColor,
    marginBottom: 4,
  },
  profileIconBody: {
    width: 23,
    height: 11,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderColor: menuActionTextColor,
  },
  gearIconText: {
    color: menuActionTextColor,
    fontSize: 42,
    lineHeight: 42,
    fontWeight: "600",
  },
  pillIcon: {
    width: 29,
    height: 14,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: menuActionTextColor,
    transform: [{ rotate: "-42deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  pillDivider: {
    width: 2.5,
    height: 12,
    backgroundColor: menuActionTextColor,
  },
  foodIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: menuActionTextColor,
    alignItems: "center",
    justifyContent: "center",
  },
  foodIconLeaf: {
    width: 12,
    height: 17,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: menuActionTextColor,
    transform: [{ rotate: "35deg" }],
  },
  lockIconShackle: {
    width: 16,
    height: 13,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderColor: menuActionTextColor,
    marginBottom: -2,
  },
  lockIconBody: {
    width: 25,
    height: 17,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: menuActionTextColor,
  },
  circleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: menuActionTextColor,
    alignItems: "center",
    justifyContent: "center",
  },
  menuSymbolText: {
    color: menuActionTextColor,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center",
  },
  menuActionText: {
    flex: 1,
    color: menuActionTextColor,
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
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
    color: colors.primary,
    marginBottom: 10,
  },
  bigText: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
  },
  helperText: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 2,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 6,
  },
  dayBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  dayDose: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  dayDoseUnit: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.mutedText,
    marginTop: 1,
    lineHeight: 11,
    textAlign: "center",
  },
  inrBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  inrLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 8,
  },
  inrValue: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.primary,
  },
  inrStatus: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 6,
    textAlign: "center",
  },
  inrHistoryLink: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
    width: "100%",
  },
  inrHistoryLinkText: {
    color: mode === "dark" ? "#93A4AE" : "#8A9AA3",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: inrButtonOrange,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#8a5f0c",
    shadowOpacity: mode === "light" ? 0.28 : 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: mode === "light" ? 5 : 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: colors.button,
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inrRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  inrBoxHalf: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 190,
  },
  resultBoxHalf: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 190,
    position: "relative",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    lineHeight: 21,
    maxWidth: "82%",
  },
  resultText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  resultPlaceholder: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 10,
  },
  todayDoseBox: {
    backgroundColor: todayDoseBlue,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginBottom: 10,
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
  todayDateStop: {
    color: mode === "dark" ? "#ffffff" : "#8A2F2F",
    marginBottom: 14,
    fontWeight: "700",
  },
  todayTitle: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "700",
    color: todayDoseTextBlue,
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
    backgroundColor: mode === "dark" ? inrButtonOrange : "#C77D1A",
  },

  halfTablet: {
    backgroundColor: mode === "dark" ? inrButtonOrange : "#C77D1A",
  },

  emptyTablet: {
    backgroundColor: emptyTabletColor,
  },

  halfTabletCover: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    backgroundColor: emptyTabletColor,
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
  todayDoseBoxStop: {
    backgroundColor: mode === "dark" ? "#4A1F28" : "#E7D7D7",
    borderColor: mode === "dark" ? "#FB7185" : "#9B4A4A",
    justifyContent: "center",
  },

  stopDoseContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  stopTextGroup: {
    alignItems: "center",
    justifyContent: "center",
  },

  stopTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: mode === "dark" ? "#FFE4E6" : "#8A2F2F",
    marginBottom: 8,
    textAlign: "center",
  },

  stopInfo: {
    fontSize: 17,
    fontWeight: "700",
    color: mode === "dark" ? "#FECDD3" : "#8A2F2F",
    marginBottom: 6,
    textAlign: "center",
  },

  stopCheck: {
    fontSize: 14,
    fontWeight: "600",
    color: mode === "dark" ? "#FDA4AF" : "#5F2A2A",
    textAlign: "center",
  },

  warningBanner: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 6,
    borderWidth: mode === "dark" ? 1 : 0,
  },

  warningBannerCritical: {
    backgroundColor: mode === "dark" ? "#4A1F28" : "#FDE2E2",
    borderColor: mode === "dark" ? "#FB7185" : "transparent",
  },

  warningBannerDanger: {
    backgroundColor: mode === "dark" ? "#4A2A16" : "#FFE8CC",
    borderColor: mode === "dark" ? "#FB923C" : "transparent",
  },

  warningBannerWarning: {
    backgroundColor: mode === "dark" ? "#43330F" : "#FFF4CC",
    borderColor: mode === "dark" ? "#FACC15" : "transparent",
  },

  warningBannerInfo: {
    backgroundColor: mode === "dark" ? "#17344A" : "#E5F3FF",
    borderColor: mode === "dark" ? "#38BDF8" : "transparent",
  },

  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: mode === "dark" ? "#F8FAFC" : "#1F2937",
  },

  warningText: {
    fontSize: 14,
    color: mode === "dark" ? "#E5E7EB" : "#374151",
  },

  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  warningIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  resultHeader: {
    minHeight: 30,
    justifyContent: "center",
    marginBottom: 14,
    paddingRight: 28,
  },

  infoButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  infoIcon: {
    fontSize: 16,
    color: colors.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContent: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 16,
  },

  modalText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },

  modalButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  resultLabel: {
    fontSize: 13,
    color: colors.mutedText,
    marginBottom: 4,
  },

  resultDose: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 16,
  },

  resultCheck: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  });
};
