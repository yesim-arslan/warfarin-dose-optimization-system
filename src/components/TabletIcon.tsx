import React from "react";
import { View, StyleSheet } from "react-native";

type TabletIconProps = {
  type: 1 | 0.5;
};

export default function TabletIcon({ type }: TabletIconProps) {
  const isHalf = type === 0.5;

  return (
    <View style={[styles.tablet, isHalf && styles.halfTablet]}>
      <View style={styles.verticalLine} />
      <View style={styles.horizontalLine} />
      {isHalf && <View style={styles.halfCover} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tablet: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3AE1A",
    borderWidth: 2,
    borderColor: "#2F667C",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  halfTablet: {
    backgroundColor: "#F3AE1A",
  },
  verticalLine: {
    position: "absolute",
    width: 2,
    height: "100%",
    backgroundColor: "#2F667C",
    zIndex: 2,
  },
  horizontalLine: {
    position: "absolute",
    height: 2,
    width: "100%",
    backgroundColor: "#2F667C",
    zIndex: 2,
  },
  halfCover: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "#F4F6F8",
    zIndex: 1,
  },
});