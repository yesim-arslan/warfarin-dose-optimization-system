import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Indication } from "../algorithms/doseTypes";
import { indicationOptions } from "../constants/indications";
import { useLanguage } from "../i18n/LanguageContext";

type IndicationSelectProps = {
  value: Indication | "";
  onChange: (value: Indication) => void;
  placeholder?: string;
  colors: {
    background: string;
    border: string;
    text: string;
    placeholder: string;
    icon: string;
    optionBackground: string;
    optionBorder: string;
  };
};

export default function IndicationSelect({
  value,
  onChange,
  placeholder,
  colors,
}: IndicationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const indicationLabels: Record<Indication, string> = {
    af_stroke: t("indicationAfStroke"),
    single_valve: t("indicationSingleValve"),
    double_valve: t("indicationDoubleValve"),
    thrombosis: t("indicationThrombosis"),
  };

  const selectedLabel = value
    ? indicationLabels[value] ?? t("notSelected")
    : placeholder ?? t("selectIndication");

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[
          styles.control,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
        onPress={() => setIsOpen((open) => !open)}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.controlText,
            { color: value ? colors.text : colors.placeholder },
          ]}
        >
          {selectedLabel}
        </Text>

        <View style={styles.menuIcon}>
          <View style={[styles.menuLine, { backgroundColor: colors.icon }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.icon }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.icon }]} />
        </View>
      </Pressable>

      {isOpen && (
        <View
          style={[
            styles.optionList,
            {
              backgroundColor: colors.optionBackground,
              borderColor: colors.optionBorder,
            },
          ]}
        >
          {indicationOptions.map((option) => {
            const isSelected = value === option.value;

            return (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  isSelected && { backgroundColor: colors.background },
                ]}
                onPress={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.text },
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {indicationLabels[option.value]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
    zIndex: 10,
  },
  control: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    marginRight: 12,
  },
  menuIcon: {
    width: 30,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLine: {
    width: 28,
    height: 3,
    borderRadius: 2,
  },
  optionList: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    zIndex: 20,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
  },
  optionTextSelected: {
    fontWeight: "900",
  },
});
