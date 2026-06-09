import React from "react";
import { drugInteractions, localizeInteractionItems } from "../constants/interactionLists";
import InteractionListScreen from "./InteractionListScreen";
import { useLanguage } from "../i18n/LanguageContext";

export default function DrugInteractionsScreen() {
  const { language, t } = useLanguage();

  return (
    <InteractionListScreen
      title={t("affectingDrugsTitle")}
      searchPlaceholder={t("searchDrug")}
      notFoundText={t("drugNotFound")}
      items={localizeInteractionItems(drugInteractions, "drug", language)}
    />
  );
}
