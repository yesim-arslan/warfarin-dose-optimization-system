# ML Extension (Phase 2 — Personalization)

## Objective
Learn patient-specific response patterns so that the system can recommend safer, more effective dose adjustments than fixed rules.

## ML Tasks (Options)
1) **Regression:** Predict next INR given current state (dose, history, risk features)
2) **Classification:** Predict "will INR be in range next week?"
3) **Reinforcement Learning (future):** Learn dose actions that maximize time-in-therapeutic-range under safety constraints

## Features (Candidate)
- INR history window (last N values)
- last dose change magnitude
- INR variability (stability)
- risk category
- interaction indicators (optional)

## Safety Approach
ML does NOT override safety constraints:
- ML suggests an adjustment
- Safety validator enforces hard bounds
- If unsafe → fallback to conservative rule-based output

## Evaluation
- Time in therapeutic range (TTR proxy)
- Mean absolute error (if regression)
- Rate of unsafe recommendations (must be near zero)
- Stability improvement vs baseline rules
