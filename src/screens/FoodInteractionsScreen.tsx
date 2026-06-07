import React from "react";
import { foodInteractions } from "../constants/interactionLists";
import InteractionListScreen from "./InteractionListScreen";

export default function FoodInteractionsScreen() {
  return (
    <InteractionListScreen
      title="INR'yi Etkileyen Gıdalar"
      searchPlaceholder="Gıda ara"
      notFoundText="Aradığınız gıda bulunamadı. Detaylı bilgi için doktorunuza başvurunuz."
      items={foodInteractions}
    />
  );
}
