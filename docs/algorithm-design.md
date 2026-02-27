# Algorithm Design (Phase 1 — Rule-Based)

## Core Idea
A rule-based engine adjusts weekly dose based on INR deviation from target bounds, with strict safety limits.

## Parameters
- target_low, target_high
- max_change_percent_per_step (e.g., 10–15%)
- risk_modifier (smaller steps for high-risk)

## High-Level Rules (Example)
- If INR < target_low: increase dose (small step)
- If INR > target_high: decrease dose (small step)
- If INR within range: keep dose stable
- If INR extremely high/low: trigger safety alert + conservative recommendation

## Pseudocode
1. Determine bounds by risk category
2. Compute deviation from target
3. Choose adjustment direction (+/-/0)
4. Apply bounded percent change
5. Validate with safety constraints
6. Output recommendation + rationale

## Output Rationale (Explainability)
Every recommendation must produce an explanation:
- "INR below target → increase by 5% (risk category: moderate, step limited by max_change)"
