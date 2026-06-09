import React from "react";
import { foodInteractions, localizeInteractionItems } from "../constants/interactionLists";
import InteractionListScreen from "./InteractionListScreen";
import { useLanguage } from "../i18n/LanguageContext";

export default function FoodInteractionsScreen() {
  const { language, t } = useLanguage();

  return (
    <InteractionListScreen
      title={t("affectingFoodsTitle")}
      searchPlaceholder={t("searchFood")}
      notFoundText={t("foodNotFound")}
      items={localizeInteractionItems(foodInteractions, "food", language)}
    />
  );
}
