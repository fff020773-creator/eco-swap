# Eco-Swap Phase 3 — Member 2

## Scope
- **Error Tracking:** Counts invalid publish attempts separately for title, description, and photo. `onError` callback exposes event details for integration with Member 3's Friction Log/database.
- **Contextual Adaptation:** After **two failed attempts on the same field**, shows targeted guidance, highlights the invalid field, and allows optional content to be hidden. Uses React state and real form events, not a static Figma simulation.
- Accessible form labels, focus on first invalid field, `aria-invalid`, live error/status messages.

## Run
Requires Node.js. In this folder:
```bash
npm install
npm run dev
```
Open the localhost URL printed by Vite.

## Test
1. Click **Review listing** with all fields empty: error counters reach 1, fields highlight.
2. Click it again: counters reach 2; adaptive help appears, including field-specific tips.
3. Fill title, description, and select a photo: errors clear; click Review listing; success message appears.
4. Optional `onPublish` receives validated data. **Actual server publishing is not implemented**; connect it to Member 1's publish flow.
5. `onError` sends errors to callback only. **No database or live friction logging is implemented**; Member 3 may connect those features.

## Integrate into the main React app
Copy `src/AdaptiveSwapForm.jsx` and `src/style.css` (or merge CSS into existing styles). Import:
```jsx
import AdaptiveSwapForm from './AdaptiveSwapForm';
<AdaptiveSwapForm onPublish={handlePublish} onError={handleError} />
```
Replace the existing Swap form route with the component or reuse its validation/adaptation logic inside the existing form. Avoid importing the demo `.phone` layout if the main app already has its own shell/navigation.

## Figma basis
Eco-Swap V2 — `Phase 2 / Swap / Required details` and `Phase 2 / Swap / Upload error`, with original light green background and green/maroon palette. This is an independent **implementation demo**, not a complete pixel-perfect conversion of all screens.

## Suggested HCI mapping
| Feature | Implementation | Principle | Goal |
|---|---|---|---|
| Dynamic Error Adaptation | React state counts invalid attempts and focuses invalid fields | Nielsen: Error Prevention & Recovery | Reduce repeated mistakes |
| Cognitive Load Reduction | Targeted guidance after 2 failures; optional fields can be hidden | Hick's Law | Reduce distracting choices |

## Prompt log template (fill with prompts actually used)
| Prompt used | Issue found | Revision | Result |
|---|---|---|---|
| [Insert actual prompt] | [Actual issue] | [Actual change] | [Verified outcome] |
