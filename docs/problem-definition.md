# Problem Definition

## Background
Warfarin is an anticoagulant requiring continuous INR monitoring. Dose adjustment decisions are sensitive and must respect safety constraints.

## Engineering Framing
We model Warfarin dose adjustment as a constrained decision problem:

### Inputs
- Current INR (t)
- Previous INR values (t-1, t-2, ...)
- Current weekly dose
- Patient risk category (bleeding/thrombosis)
- Interaction indicators (drug/food, optional)

### Output
- Recommended weekly dose plan (mg/week) and/or daily schedule

## Constraints (Safety)
- INR target range depends on patient context (baseline assumption: 2.0–3.0)
- Dose changes must be gradual (bounded change per step)
- High-risk patients require stricter adjustment rules and monitoring frequency

## Goal
Design an explainable decision-support system that:
1) produces safe and consistent dose recommendations,
2) validates decisions against hard safety boundaries,
3) enables ML-based personalization after baseline verification.
