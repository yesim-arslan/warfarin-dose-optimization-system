# Personalized INR Monitoring & Warfarin Dose Optimization System

A cross-platform mobile application prototype for personalized INR monitoring and Warfarin dose optimization.

This project supports patients using Warfarin/Coumadin by helping them record INR measurements, follow their weekly medication plan, review INR history, and receive rule-based dose adjustment guidance based on clinical safety constraints.

> ⚠️ This project is an academic prototype and clinical decision-support concept. It is not intended to replace physician evaluation, medical diagnosis, or direct medical supervision.

---

## Project Overview

Warfarin treatment requires regular INR monitoring to keep patients within a safe therapeutic range. INR values below the target range may increase thrombotic risk, while INR values above the target range may increase bleeding risk.

This system provides a mobile interface where users can:

- create an account and complete the initial medical consent flow,
- select treatment indication and target INR range,
- enter INR measurements,
- view current INR status and weekly Warfarin dose plan,
- receive rule-based dose recommendations,
- see daily medication distribution with tablet-based visualization,
- track INR history with time-range filtering,
- review medical warnings,
- review food and drug interaction information,
- manage profile and treatment data,
- switch between light and dark mode,
- delete their account and related stored data.

The project combines mobile health, rule-based clinical decision support, Firebase-based data storage, and user-centered mobile interface design.

---

## Main Features

### Mobile Application

- React Native / Expo based cross-platform mobile app
- TypeScript implementation
- Firebase Authentication for login and registration
- Cloud Firestore integration for user profile, INR records, and recommendations
- Medical consent flow before registration
- Initial treatment indication selection flow
- Home dashboard for current INR, target range, weekly dose, warnings, and next control timing
- INR entry screen
- INR history screen with chart-style visualization and selectable time ranges
- Weekly dose visualization using tablet-based UI
- Right-side home menu navigation
- Profile screen for user and treatment information
- Settings screen with light/dark theme selection
- Help, about, privacy policy, medical warnings, food interactions, and drug interactions screens
- Dedicated account deletion screen with password reauthentication

### Dose Optimization Logic

The dose adjustment logic is based on:

- patient’s current INR value,
- target INR range,
- current weekly Warfarin dose,
- treatment indication,
- clinical safety rules,
- predefined warning protocols,
- follow-up INR control timing.

The rule-based engine calculates weekly dose recommendations and distributes the weekly total across the week. The result is shown to the user as both a weekly total and a daily tablet-based plan.

### Risk & Warning System

The application includes warning logic for cases such as:

- INR below target range,
- INR above target range,
- very high INR values requiring temporary medication stop,
- possible need for doctor consultation,
- bleeding risk warnings,
- thrombotic risk warnings,
- follow-up INR control timing.

### Interaction Information

The app includes informational screens for:

- food interactions, especially foods related to vitamin K intake,
- drug interactions that may affect Warfarin safety,
- general medical warnings for users taking anticoagulant medication.

These screens are educational and do not replace professional medical advice.

---

## Technology Stack

- **Frontend:** React Native, Expo
- **Language:** TypeScript
- **Navigation:** React Navigation Native Stack
- **Backend / Database:** Firebase
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **State / Theme:** React Context
- **Testing:** Jest, ts-jest, jest-expo
- **Design:** Figma
- **Version Control:** Git & GitHub

---

## Repository Structure

```text
.
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── jest.config.js
├── firebase.json
├── firestore.rules
├── assets/
├── docs/
├── src/
│   ├── algorithms/
│   ├── components/
│   ├── constants/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── theme/
│   └── types/
├── ARCHITECTURE.md
├── ROADMAP.md
└── README.md
```

---

## Key Screens

- **Login Screen:** User login with Firebase Authentication
- **Medical Consent Screen:** Medical disclaimer and consent before sign-up
- **Sign Up Screen:** User registration
- **Indication Reason Screen:** Initial treatment indication selection
- **Home Screen:** Current INR status, weekly dose plan, warnings, and menu
- **Enter INR Screen:** INR measurement entry and recommendation generation
- **INR History Screen:** Previous INR measurements and chart-style trend display
- **User Profile Screen:** Profile and treatment information management
- **Settings Screen:** Light/dark mode selection
- **Medical Warnings Screen:** General safety warnings
- **Food Interactions Screen:** Food and vitamin K related information
- **Drug Interactions Screen:** Drug interaction information
- **Privacy Policy Screen:** Privacy information
- **About Screen:** Project information
- **Help Screen:** User guidance
- **Delete Account Screen:** Permanent account and data deletion flow

---

## Firebase Data Usage

The application uses Firebase for authentication and cloud data storage.

Stored data may include:

- user profile information,
- treatment indication,
- target INR range,
- current weekly dose,
- INR measurement records,
- generated dose recommendation outputs,
- theme preference.

Account deletion removes related Firestore data and then deletes the Firebase Authentication user account.

---

## Development Status

Current status:

- ✅ Mobile application prototype implemented
- ✅ Firebase Authentication integrated
- ✅ Cloud Firestore data flow implemented
- ✅ Medical consent and sign-up flow added
- ✅ Initial indication selection flow added
- ✅ INR entry and home dashboard flow developed
- ✅ Rule-based dose calculation logic implemented
- ✅ Weekly dose visualization implemented
- ✅ INR history screen added
- ✅ Food and drug interaction information screens added
- ✅ Medical warnings, help, about, and privacy screens added
- ✅ App-wide light/dark theme system added
- ✅ Dedicated account deletion flow added
- ✅ Academic documentation prepared
- 🟡 Further validation and clinical rule coverage improvements in progress
- 🔜 Future extension: ML-based personalization after rule-based validation

---

## Planned Future Improvements

- Improve clinical rule coverage for all INR scenarios
- Expand warning protocol integration
- Improve interaction data structure for drugs and foods
- Add doctor-facing or exportable report view
- Strengthen Firebase security rules
- Improve offline/error handling
- Add more unit tests for dose calculation and recommendation logic
- Improve INR trend visualization
- Add ML-based personalization after rule-based validation

---

## Phase Plan

### Phase 1 — Rule-Based Clinical Decision Support

The first phase focuses on implementing a transparent and explainable dose adjustment engine based on predefined clinical rules and safety boundaries.

### Phase 2 — ML-Based Personalization

The second phase aims to explore machine learning models that can adapt recommendations to patient-specific INR response patterns after sufficient validation data is collected.

Potential ML goals:

- predict INR response trends,
- identify unstable INR patterns,
- support smaller personalized dose adjustments,
- provide explainable risk indicators.

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on the web:

```bash
npm run web
```

Run tests:

```bash
npm test
```

Type-check the project:

```bash
npx tsc --noEmit
```

---

## Academic Documentation

This repository also includes academic and project documentation related to the senior design and TÜBİTAK 2209-B project process.

The included documentation may cover:

- TÜBİTAK 2209-B research proposal,
- senior design project documentation,
- INR dose adjustment flowcharts,
- clinical protocol logic,
- UI/UX design outputs,
- project poster and presentation materials,
- risk model documentation,
- ML extension planning,
- algorithm design documentation.

These documents explain the project motivation, clinical background, algorithmic approach, system design, and planned validation methodology.

---

## Disclaimer

This project is developed for academic and research purposes.

The application does not provide a final medical diagnosis, does not replace professional medical advice, and must not be used as the only basis for medication decisions. Any Warfarin/Coumadin dose adjustment must be reviewed and approved by a qualified healthcare professional.

---

## Author

**Yeşim Arslan**  
Muğla Sıtkı Koçman University  
Department of Computer Engineering
