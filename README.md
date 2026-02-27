# Personalized INR Monitoring & Warfarin Dose Optimization System

## Overview
This repository contains the system design and development plan for a clinical decision-support tool that recommends personalized weekly Warfarin dose adjustments based on INR monitoring, safety constraints, and risk modeling.

The project is structured in two phases:
- **Phase 1:** Rule-based dose adjustment with clinical safety constraints
- **Phase 2:** **ML-based personalization** to adapt recommendations to patient-specific response patterns

## Why this matters
Warfarin dosing requires careful INR follow-up. Incorrect or inconsistent adjustments may increase:
- bleeding risk
- thrombotic risk
- INR instability

This project aims to formalize dosing into an **explainable, safety-aware computational decision system**.

## Planned Modules
- INR Monitoring & History Tracking
- Risk Category Modeling (low / moderate / high risk)
- Rule-Based Dose Adjustment Engine (Phase 1)
- Safety Constraint Validator (hard boundaries)
- ML Personalization Layer (Phase 2)
  - predicts INR response / stability
  - suggests smaller, patient-specific adjustments
  - provides explainability (feature importance / rationale)

## Repository Structure
- `/docs` → problem, algorithm, risk model, ML plan
- `/assets` → diagrams, UI wireframes (optional)
- `ROADMAP.md` → milestones & phases
- `ARCHITECTURE.md` → system architecture and data flow

## Academic Documentation

- TÜBİTAK 2209-B Research Proposal  
- Senior Design Final Report  
- INR Dose Adjustment Flowcharts  

These documents describe the clinical protocol foundation, 
dose optimization algorithm logic, and system validation methodology.

## Status
✅ Planning & documentation  
🟡 Implementation starting soon  
🔜 ML extension after baseline validation

## Author
Yesim Arslan
Muğla Sıtkı Koçman University — Computer Engineering
