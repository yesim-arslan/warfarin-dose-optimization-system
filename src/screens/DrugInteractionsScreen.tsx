import React from "react";
import { drugInteractions } from "../constants/interactionLists";
import InteractionListScreen from "./InteractionListScreen";

export default function DrugInteractionsScreen() {
  return (
    <InteractionListScreen
      title="INR'yi Etkileyen İlaçlar"
      searchPlaceholder="İlaç ara"
      notFoundText="Aradığınız ilaç bulunamadı. Detaylı bilgi için doktorunuza başvurunuz."
      items={drugInteractions}
    />
  );
}
