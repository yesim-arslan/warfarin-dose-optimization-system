# Personalized INR Monitoring & Warfarin Dose Optimization System

A cross-platform mobile application prototype for personalized INR monitoring and Warfarin dose optimization.

This project aims to support patients using Warfarin/Coumadin by helping them track INR values, visualize weekly medication schedules, and receive rule-based dose adjustment guidance based on clinical safety constraints.

> ⚠️ This project is an academic prototype and clinical decision-support concept. It is not intended to replace physician evaluation or direct medical supervision.

---

## Project Overview

Warfarin treatment requires regular INR monitoring to keep patients within a safe therapeutic range. INR values that are too low may increase thrombotic risk, while values that are too high may increase bleeding risk.

This system provides a mobile interface where users can:

- enter INR measurements,
- view their current target INR range,
- receive rule-based weekly dose guidance,
- see daily medication distribution visually,
- receive warnings for critical INR situations,
- track INR history over time.

The project combines mobile health, rule-based clinical decision support, and user-centered interface design.

---

## Main Features

### Mobile Application

- React Native / Expo based cross-platform mobile app
- TypeScript implementation
- Firebase Authentication for user login and registration
- Cloud Firestore integration for storing user and INR-related data
- INR entry screen
- Home dashboard for current INR and weekly medication plan
- Weekly dose visualization using tablet-based UI
- User profile and treatment information flow
- Rule-based dose adjustment output
- Safety warnings for low or high INR values

### Dose Optimization Logic

The dose adjustment logic is based on:

- patient’s current INR value,
- target INR range,
- current weekly Warfarin dose,
- treatment indication,
- clinical safety rules,
- predefined warning protocols.

The rule-based engine adjusts weekly dose recommendations and distributes the result across the week using tablet-based daily dose visualization.

### Risk & Warning System

The application includes warning logic for cases such as:

- INR below target range,
- INR above target range,
- very high INR values requiring temporary medication stop,
- possible need for doctor consultation,
- bleeding risk warnings,
- follow-up INR control timing.

---

## Technology Stack

- **Frontend:** React Native, Expo
- **Language:** TypeScript
- **Backend / Database:** Firebase
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Design:** Figma
- **Version Control:** Git & GitHub

---

## Repository Structure

\`\`\`text
.
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── jest.config.js
├── assets/
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── algorithms/
│   ├── navigation/
│   └── types/
├── docs/
└── README.md
\`\`\`

> Some folders may evolve as the implementation continues.

---

## Academic Documentation

This repository also includes academic and project documentation related to the senior design and TÜBİTAK 2209-B project process.

Included documentation may cover:

- TÜBİTAK 2209-B research proposal,
- senior design project documentation,
- INR dose adjustment flowcharts,
- clinical protocol logic,
- UI/UX design outputs,
- project poster and presentation materials.

These documents explain the project motivation, clinical background, algorithmic approach, system design, and planned validation methodology.

---

## Development Status

Current status:

- ✅ Mobile application prototype implemented
- ✅ Firebase Authentication integrated
- ✅ Firestore data structure started
- ✅ INR entry and home screen flow developed
- ✅ Rule-based dose calculation logic started
- ✅ Weekly dose visualization implemented
- ✅ Academic documentation prepared
- 🟡 Further backend and validation improvements in progress
- 🔜 Future extension: ML-based personalization after baseline validation

---

## Planned Future Improvements

- Improve clinical rule coverage for all INR scenarios
- Complete full warning protocol integration
- Add medication and food interaction matrix
- Improve INR history visualization
- Add doctor-facing or exportable report view
- Strengthen Firebase security rules
- Add unit tests for dose calculation logic
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

## Disclaimer

This project is developed for academic and research purposes.

The application does not provide a final medical diagnosis or replace professional medical advice. Any medication adjustment must be reviewed and approved by a qualified healthcare professional.

---

## Author

**Yeşim Arslan**  
Muğla Sıtkı Koçman University  
Department of Computer Engineering
