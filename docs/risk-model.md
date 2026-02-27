# Risk Model

## Categories (Initial Design)
### Low Risk
- Stable INR history
- No recent bleeding events

### Moderate Risk
- Occasional INR fluctuation
- Some interaction risks

### High Risk
- History of bleeding/thrombosis
- Frequent INR instability
- Multiple interacting medications (optional)

## How risk affects decisions
Risk category modifies:
- target INR interval (narrower for high-risk if needed)
- dose adjustment step size (smaller for high-risk)
- alert thresholds (more conservative)
- recommended monitoring frequency
