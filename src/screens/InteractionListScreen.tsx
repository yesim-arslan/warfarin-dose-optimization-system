import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { InteractionItem } from "../constants/interactionLists";
import { AppThemeColors, useTheme } from "../theme/ThemeContext";
import { requestHomeMenuOpen } from "../navigation/menuReturn";

type InteractionListScreenProps = {
  title: string;
  searchPlaceholder: string;
  notFoundText: string;
  items: InteractionItem[];
};

export default function InteractionListScreen({
  title,
  searchPlaceholder,
  notFoundText,
  items,
}: InteractionListScreenProps) {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState<InteractionItem | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedSearch) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLocaleLowerCase("tr-TR").includes(normalizedSearch) ||
        item.category.toLocaleLowerCase("tr-TR").includes(normalizedSearch)
    );
  }, [items, searchText]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            requestHomeMenuOpen();
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.mutedText}
        />
        <Text style={styles.searchIcon}>⌕</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.listCard}>
          {filteredItems.length === 0 ? (
            <Text style={styles.notFoundText}>{notFoundText}</Text>
          ) : (
            filteredItems.map((item) => (
              <View key={`${item.name}-${item.category}`} style={styles.listRow}>
                <View style={styles.itemTextGroup}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>

                <Pressable
                  style={styles.infoButton}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text style={styles.infoButtonText}>i</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={!!selectedItem}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.warningIcon}>⚠</Text>
              <Text style={styles.infoTitle}>{selectedItem?.name}</Text>
              <Pressable onPress={() => setSelectedItem(null)}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.infoCategory}>{selectedItem?.category}</Text>
            <View style={styles.infoDivider} />
            <Text style={styles.infoDetail}>{selectedItem?.detail}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      minHeight: 86,
      paddingTop: 18,
      paddingHorizontal: 22,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    backButton: {
      width: 74,
      height: 42,
      alignItems: "flex-start",
      justifyContent: "center",
      marginRight: 8,
    },
    backButtonText: {
      color: "#ffffff",
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
    },
    headerTitle: {
      flex: 1,
      color: "#ffffff",
      fontSize: 19,
      fontWeight: "700",
      textAlign: "center",
      marginRight: 82,
    },
    searchBox: {
      minHeight: 48,
      marginHorizontal: 32,
      marginTop: 18,
      marginBottom: 16,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
      paddingVertical: 10,
    },
    searchIcon: {
      color: colors.primary,
      fontSize: 25,
      fontWeight: "800",
      marginLeft: 10,
    },
    listContent: {
      paddingHorizontal: 32,
      paddingBottom: 28,
    },
    listCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listRow: {
      minHeight: 54,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
    },
    itemTextGroup: {
      flex: 1,
      paddingVertical: 7,
    },
    itemName: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: "700",
    },
    itemCategory: {
      color: colors.mutedText,
      fontSize: 12,
      marginTop: 2,
    },
    infoButton: {
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 10,
    },
    infoButtonText: {
      width: 19,
      height: 19,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary,
      color: colors.primary,
      fontSize: 13,
      lineHeight: 16,
      fontWeight: "900",
      textAlign: "center",
    },
    notFoundText: {
      color: colors.mutedText,
      fontSize: 15,
      lineHeight: 22,
      paddingVertical: 24,
      textAlign: "center",
    },
    modalOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 28,
      backgroundColor: "rgba(0,0,0,0.24)",
    },
    infoCard: {
      width: "100%",
      maxWidth: 320,
      borderRadius: 18,
      padding: 18,
      backgroundColor: "#FFD878",
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 7,
    },
    infoHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    warningIcon: {
      color: "#DC2626",
      fontSize: 24,
      fontWeight: "900",
      marginRight: 10,
    },
    infoTitle: {
      flex: 1,
      color: "#111827",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },
    closeText: {
      color: "#111827",
      fontSize: 26,
      lineHeight: 26,
      fontWeight: "500",
      paddingLeft: 10,
    },
    infoCategory: {
      color: "#111827",
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700",
      marginBottom: 10,
    },
    infoDivider: {
      height: 1,
      backgroundColor: "rgba(47,102,124,0.32)",
      marginBottom: 12,
    },
    infoDetail: {
      color: "#111827",
      fontSize: 12,
      lineHeight: 17,
      fontWeight: "500",
    },
  });
