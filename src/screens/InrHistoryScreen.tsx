import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { auth } from "../services/firebase";
import { getInrRecords } from "../services/firestore";
import { InrRecord } from "../types/models";
import { useLanguage } from "../i18n/LanguageContext";

const chartRangeOptions = [
  { labelKey: "oneDay", amount: 1, unit: "day" },
  { labelKey: "oneMonth", amount: 1, unit: "month" },
  { labelKey: "sixMonths", amount: 6, unit: "month" },
  { labelKey: "oneYear", amount: 1, unit: "year" },
] as const;

type ChartRangeOption = (typeof chartRangeOptions)[number];

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { dateText: "-", timeText: "-" };
  }

  return {
    dateText: date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    timeText: date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const formatShortDateFromDate = (date: Date) =>
  date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  });

const getRangeStartDate = (range: ChartRangeOption) => {
  const startDate = new Date();

  if (range.unit === "day") {
    startDate.setDate(startDate.getDate() - range.amount);
  } else if (range.unit === "month") {
    startDate.setMonth(startDate.getMonth() - range.amount);
  } else {
    startDate.setFullYear(startDate.getFullYear() - range.amount);
  }

  return startDate;
};

export default function InrHistoryScreen() {
  const navigation = useNavigation<any>();
  const { colors, mode } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors, mode);
  const [records, setRecords] = useState<InrRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [selectedChartRange, setSelectedChartRange] =
    useState<ChartRangeOption>(chartRangeOptions[1]);
  const selectedChartWindow = useMemo(() => {
    const endDate = new Date();
    const startDate = getRangeStartDate(selectedChartRange);

    return {
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
    };
  }, [selectedChartRange]);
  const chronologicalRecords = useMemo(
    () =>
      [...records].sort(
        (left, right) =>
          new Date(left.measuredAt).getTime() -
          new Date(right.measuredAt).getTime()
      ),
    [records]
  );
  const chartRecords = useMemo(() => {
    return chronologicalRecords.filter((record) => {
      const measuredAt = new Date(record.measuredAt).getTime();

      return (
        !Number.isNaN(measuredAt) &&
        measuredAt >= selectedChartWindow.startTime &&
        measuredAt <= selectedChartWindow.endTime
      );
    });
  }, [
    chronologicalRecords,
    selectedChartWindow.endTime,
    selectedChartWindow.startTime,
  ]);

  const chartValues = useMemo(() => {
    if (chartRecords.length === 0) {
      return null;
    }

    const inrValues = chartRecords.map((record) => record.inr);
    const minValue = Math.min(...inrValues);
    const maxValue = Math.max(...inrValues);
    const chartMin = Math.max(0, Math.floor(minValue) - 0.5);
    const chartMax = Math.ceil(maxValue) + 0.5;
    const chartRange = Math.max(chartMax - chartMin, 1);

    return {
      min: chartMin,
      max: chartMax,
      points: chartRecords.map((record, index) => ({
        key: record.id ?? `${record.measuredAt}-${index}`,
        value: record.inr,
        x:
          chartRecords.length === 1
            ? 50
            : 7 + (index / (chartRecords.length - 1)) * 86,
        y: 14 + ((chartMax - record.inr) / chartRange) * 72,
      })),
      firstDate: formatShortDateFromDate(new Date(chartRecords[0].measuredAt)),
      lastDate: formatShortDateFromDate(
        new Date(chartRecords[chartRecords.length - 1].measuredAt)
      ),
    };
  }, [chartRecords]);
  const pointLabels = useMemo(() => {
    if (!chartValues || chartSize.width === 0 || chartSize.height === 0) {
      return [];
    }

    const labelHeight = 16;
    const minimumGap = 18;
    const labels = chartValues.points
      .map((point, index) => {
        const x = (point.x / 100) * chartSize.width;
        const y = (point.y / 100) * chartSize.height;

        return {
          key: point.key,
          value: point.value,
          x,
          y,
          index,
          top: Math.max(0, Math.min(chartSize.height - labelHeight, y - 28)),
        };
      })
      .sort((left, right) => left.top - right.top);

    for (let index = 1; index < labels.length; index += 1) {
      const previous = labels[index - 1];
      const current = labels[index];

      if (current.top - previous.top < minimumGap) {
        current.top = previous.top + minimumGap;
      }
    }

    const overflow =
      labels.length > 0
        ? labels[labels.length - 1].top - (chartSize.height - labelHeight)
        : 0;

    if (overflow > 0) {
      for (let index = labels.length - 1; index >= 0; index -= 1) {
        labels[index].top = Math.max(0, labels[index].top - overflow);

        if (index < labels.length - 1) {
          const next = labels[index + 1];
          labels[index].top = Math.min(
            labels[index].top,
            next.top - minimumGap
          );
        }
      }
    }

    return labels.map((label) => ({
      ...label,
      left:
        label.x > chartSize.width - 58
          ? Math.max(0, label.x - 48)
          : Math.min(chartSize.width - 38, label.x + 12),
    }));
  }, [chartSize.height, chartSize.width, chartValues]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const user = auth.currentUser;

      if (!user) {
        setRecords([]);
        setIsLoading(false);
        return undefined;
      }

      const loadRecords = async () => {
        try {
          setIsLoading(true);
          const nextRecords = await getInrRecords(user.uid);

          if (isActive) {
            setRecords(nextRecords);
          }
        } catch (error) {
          console.error(error);
          Alert.alert(
            t("error"),
            t("historyLoadError")
          );
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadRecords();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{t("backHome")}</Text>
      </Pressable>

      <Text style={styles.title}>{t("historyTitle")}</Text>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{t("inrChart")}</Text>
          {chartValues ? (
            <Text style={styles.chartRangeText}>
              {chartValues.min.toFixed(1)} - {chartValues.max.toFixed(1)}
            </Text>
          ) : null}
        </View>

        <View style={styles.rangeSelector}>
          {chartRangeOptions.map((option) => {
            const isSelected = selectedChartRange.labelKey === option.labelKey;

            return (
              <Pressable
                key={option.labelKey}
                style={[
                  styles.rangeOption,
                  isSelected && styles.rangeOptionSelected,
                ]}
                onPress={() => setSelectedChartRange(option)}
              >
                <Text
                  style={[
                    styles.rangeOptionText,
                    isSelected && styles.rangeOptionTextSelected,
                  ]}
                >
                  {t(option.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isLoading ? (
          <View style={styles.chartEmptyState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : chartValues ? (
          <>
            <View style={styles.chartBody}>
              <View style={styles.yAxisLabels}>
                <Text style={styles.axisLabel}>{chartValues.max.toFixed(1)}</Text>
                <Text style={styles.axisLabel}>{chartValues.min.toFixed(1)}</Text>
              </View>

              <View
                style={styles.plotArea}
                onLayout={(event) => {
                  const { width, height } = event.nativeEvent.layout;
                  setChartSize({ width, height });
                }}
              >
                <View style={[styles.gridLine, { top: "0%" }]} />
                <View style={[styles.gridLine, { top: "50%" }]} />
                <View style={[styles.gridLine, { top: "100%" }]} />

                {chartSize.width > 0 &&
                  chartSize.height > 0 &&
                  chartValues.points.slice(0, -1).map((point, index) => {
                    const nextPoint = chartValues.points[index + 1];
                    const x1 = (point.x / 100) * chartSize.width;
                    const y1 = (point.y / 100) * chartSize.height;
                    const x2 = (nextPoint.x / 100) * chartSize.width;
                    const y2 = (nextPoint.y / 100) * chartSize.height;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                    return (
                      <View
                        key={`${point.key}-${nextPoint.key}`}
                        style={[
                          styles.chartLine,
                          {
                            left: x1 + dx / 2 - length / 2,
                            top: y1 + dy / 2,
                            width: length,
                            transform: [{ rotateZ: `${angle}deg` }],
                          },
                        ]}
                      />
                    );
                  })}

                {chartValues.points.map((point) => (
                  <View
                    key={point.key}
                    style={[
                      styles.chartPoint,
                      {
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                      },
                    ]}
                  />
                ))}

                {pointLabels.map((label) => (
                  <Text
                    key={`${label.key}-label`}
                    style={[
                      styles.pointValue,
                      {
                        left: label.left,
                        top: label.top,
                      },
                    ]}
                  >
                    {label.value.toFixed(1)}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.xAxisLabels}>
              <Text style={styles.axisLabel}>{chartValues.firstDate}</Text>
              <Text style={styles.axisLabel}>{chartValues.lastDate}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>{t("noInrInRange")}</Text>
        )}
      </View>

      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={[styles.headerText, styles.inrColumn]}>INR</Text>
          <View style={styles.dateTimeGroup}>
            <Text style={[styles.headerText, styles.dateColumn]}>{t("date")}</Text>
            <Text style={[styles.headerText, styles.timeColumn]}>{t("time")}</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : records.length === 0 ? (
          <Text style={styles.emptyText}>{t("noInrRecords")}</Text>
        ) : (
          records.map((record) => {
            const { dateText, timeText } = formatDateTime(record.measuredAt);

            return (
              <View key={record.id ?? record.measuredAt} style={styles.recordRow}>
                <Text style={[styles.inrValue, styles.inrColumn]}>
                  {record.inr.toFixed(1)}
                </Text>
                <View style={styles.dateTimeGroup}>
                  <Text style={[styles.dateText, styles.dateColumn]}>
                    {dateText}
                  </Text>
                  <Text style={[styles.dateText, styles.timeColumn]}>
                    {timeText}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: AppThemeColors, mode: "light" | "dark") =>
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
      color: colors.primary,
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 18,
    },
    chartCard: {
      backgroundColor: mode === "dark" ? colors.surfaceMuted : "#F4F8F9",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 16,
      marginBottom: 16,
    },
    chartHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    chartTitle: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "800",
    },
    chartRangeText: {
      color: colors.mutedText,
      fontSize: 12,
      fontWeight: "800",
    },
    rangeSelector: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
    },
    rangeOption: {
      flex: 1,
      minHeight: 34,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
      backgroundColor: colors.surface,
    },
    rangeOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    rangeOptionText: {
      color: colors.mutedText,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
    },
    rangeOptionTextSelected: {
      color: "#ffffff",
    },
    chartBody: {
      flexDirection: "row",
      minHeight: 150,
    },
    yAxisLabels: {
      width: 34,
      justifyContent: "space-between",
      paddingVertical: 2,
      paddingRight: 8,
    },
    plotArea: {
      flex: 1,
      minHeight: 150,
      position: "relative",
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    gridLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.border,
      opacity: 0.75,
    },
    chartLine: {
      position: "absolute",
      height: 1,
      backgroundColor: colors.primary,
      opacity: 0.9,
    },
    chartPoint: {
      position: "absolute",
      width: 14,
      height: 14,
      marginLeft: -7,
      marginTop: -7,
      borderRadius: 7,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.surface,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      alignItems: "center",
      justifyContent: "center",
    },
    pointValue: {
      position: "absolute",
      width: 38,
      color: colors.mutedText,
      fontSize: 11,
      fontWeight: "800",
      textAlign: "center",
    },
    xAxisLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 34,
      marginTop: 8,
    },
    axisLabel: {
      color: colors.mutedText,
      fontSize: 11,
      fontWeight: "700",
    },
    chartEmptyState: {
      minHeight: 150,
      alignItems: "center",
      justifyContent: "center",
    },
    listCard: {
      backgroundColor: mode === "dark" ? colors.surfaceMuted : "#F4F8F9",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 4,
    },
    listHeader: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    headerText: {
      color: colors.mutedText,
      fontSize: 13,
      fontWeight: "800",
    },
    recordRow: {
      minHeight: 58,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    inrColumn: {
      width: "24%",
      textAlign: "left",
    },
    dateTimeGroup: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      columnGap: 14,
    },
    dateColumn: {
      width: 112,
      textAlign: "right",
    },
    timeColumn: {
      width: 50,
      textAlign: "right",
    },
    inrValue: {
      color: colors.mutedText,
      fontSize: 21,
      fontWeight: "800",
    },
    dateText: {
      color: colors.mutedText,
      fontSize: 16,
      fontWeight: "700",
    },
    emptyState: {
      minHeight: 120,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      color: colors.mutedText,
      fontSize: 15,
      lineHeight: 22,
      paddingVertical: 26,
      textAlign: "center",
    },
  });
