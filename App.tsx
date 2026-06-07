import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { colors, mode } = useTheme();
  const styles = createStyles(colors, mode);

  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        <SafeAreaView edges={["top"]} style={styles.warningSafeArea}>
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              Bu uygulama bir doktor uygulaması değildir. Doğru bilgi için doktorunuza başvurunuz.
            </Text>
          </View>
        </SafeAreaView>

        <View style={styles.content}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  mode: ReturnType<typeof useTheme>["mode"]
) =>
  StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  warningSafeArea: {
    backgroundColor: mode === "dark" ? "#352a12" : "#fff4cc",
  },
  warningBanner: {
    backgroundColor: mode === "dark" ? "#352a12" : "#fff4cc",
    borderBottomColor: mode === "dark" ? "#8f6b1f" : "#d89b1d",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  warningText: {
    color: mode === "dark" ? "#f7d98a" : "#5f4200",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
});
