# Changelog

## [2.3.0] – 2026-05-07

This release modernises the card for current Home Assistant versions (2024.1+), fixes numerous crashes, and improves accessibility and build tooling. The original upstream release (v2.2.2) has not been updated since 2021.

### ⚡ HA 2026.5 Compatibility

- Migrated from `lit-element` 2.x / `lit-html` to `lit` 3.x — required for HA 2024.1+
- Updated all decorator imports to `lit/decorators.js`
- Updated `unsafeHTML` import to `lit/directives/unsafe-html.js`
- Fixed class attribute binding that broke silently in Lit 3
- Replaced `hass.resources[lang]` with `hass.localize()` — the old API was removed from HA
- Fixed broken entity existence check (`typeof entity === undefined` always returned `false`)

### 🐛 Bug Fixes

- **Header:** Fault icons crashed when `faults` was not configured — added null guard
- **Header:** Fault icons were blank in HA 2021.11+ — switched to property binding `.icon=${...}`
- **Header:** Toggle label was always `undefined` when `name: true` — `attributes.name` → `attributes.friendly_name`
- **Header:** Inline `style=` attributes replaced with proper CSS classes
- **Sensors:** Sensor icons were blank in HA 2021.11+ — switched to property binding
- **Sensors:** `hvac_action` localization key updated for modern HA; falls back to old key for compatibility
- **Sensors:** `hass.resources` replaced with `hass.localize()` in template sensor rendering
- **Editor:** Frozen config object caused crashes — `valueChanged` now operates on a deep clone
- **Editor:** `toggleHeader` mutated config directly instead of cloning first
- **Editor:** Delete broken for dotted config paths like `header.name` — added `deletePath()` helper
- **Editor:** `hasOwnProperty` replaced with `Object.hasOwn()` — safer for prototype-less objects
- **Editor:** Deprecated Polymer form components replaced — `paper-input` → `ha-textfield`, `paper-dropdown-menu` → `ha-select`, `mwc-button` → `ha-button`, `ha-icon-input` → `ha-icon-picker`
- **Editor:** `decimals` and `step_size` were stored as strings instead of numbers
- **Main:** `set hass()` crashed during HA startup when `hass.states` was not yet available
- **Main:** v3 sensors crashed when `sensors:` key was omitted — added `?? []` fallback
- **Main:** v2 sensors crashed when a configured sensor entity did not exist in `hass.states`
- **Main:** Memory leak — timers and debounce not cleared when card was removed from DOM
- **Main:** Dead `name` property conflicted with `HTMLElement.name` — removed
- **Main:** `@property()` used for internal-only state — switched to `@state()` throughout
- **Main:** Temperature `<h3>` had `role="button"` but no `@keydown` handler — added Enter/Space support
- **Main:** `updated()` called `super.connectedCallback()` instead of `super.updated(changedProperties)`
- **Main:** `_hide` accumulated state across config changes instead of resetting to defaults
- **Main:** `hui-warning` replaced with `ha-alert` (modern public API)
- **CSS:** `align-self: left` is not a valid value — changed to `align-self: flex-start`
- **CSS:** All Polymer-era CSS variables removed (`--paper-font-*`, `--iron-icon-*`, `--paper-item-icon-color`)
- **Config:** `header` and `version` fields in `CardConfig` were not optional — caused TypeScript errors with minimal configs
- **Config:** All `layout` sub-fields were required — now all optional
- **Config:** `Toggle | null` type mismatch fixed
- **Config:** `Service.data` was typed as `string`-only — loosened to `any`
- **Config:** Duplicate `DUAL` constant removed from `setpoints.ts` — imported from `getEntityType.ts`
- **formatNumber:** Returned `"NaN"` string for invalid input — now returns configured fallback
- **infoItem:** Crashed when `state.attributes` was undefined — added optional chaining
- **fireEvent:** Imported `LitElement` unnecessarily — changed to `EventTarget`

### ✨ Improvements

- **Faster temperature response** — debounce timeout reduced from 1000 ms to 500 ms
- **Auto-timeout for updating state** — "updating" indicator clears after 10 s if HA never acknowledges
- **`getLayoutOptions()` implemented** — correct grid sizing for HA 2024+ dashboards
- **Full keyboard accessibility** — all interactive elements have `role`, `tabindex`, `aria-label`, `aria-pressed`, and keyboard event handlers
- **Smooth UI transitions** — mode buttons animate on hover/press with `:focus-visible` outlines
- **Responsive temperature font size** — uses `clamp()` instead of fixed breakpoint jumps
- **`documentationURL` added** to card registration — shown in HA card picker
- **`valueChanged` unified** — correctly reads `ev.detail?.value` or `ev.target.value` depending on component

### 🔍 Final Review Fixes

- **Unused `property` import** — `property` was imported from `lit/decorators.js` but never used after switching all decorators to `@state()`. Removed. (`src/main.ts`)
- **`parseSetpoints` called with `null`** — the function signature expects `Setpoints | false` but was called with `null` when no setpoints were configured. Changed to `false`. (`src/main.ts`)
- **Redundant optional chain** — `!this.header || !this?.header?.toggle` simplified to `!this.header?.toggle`. (`src/main.ts`)
- **Wrong comment in `templated.ts`** — `// Turns autoEscaping on` was the opposite of what the code does (`autoEscape = false` turns it off). Fixed. (`src/components/templated.ts`)
- **Unused `opts` parameter** — `relativetime` Squirrelly filter defined an `opts` parameter that was never used. Removed. (`src/components/templated.ts`)
- **Leading space in fault-icon class** — `' hide'` had a leading space causing `class="fault-icon  hide"` (double space). Removed. (`src/components/header.ts`)
- **Dead `|| null` after `Array.map()`** — `sensors.map(...) || null` — `map()` never returns null. Removed the dead fallback. (`src/components/sensors.ts`)
- **`0px` → `0`** — unit should be omitted for zero values in CSS. (`src/styles.css`)
- **Unused `--manual-color` CSS variable** — defined but referenced nowhere in the stylesheet. Removed. (`src/styles.css`)
- **Unused custom media queries** — `--vp-s`, `--vp-l`, `--vp-xl` were defined but only `--vp-m` is used. Removed the three unused declarations. (`src/styles.css`)

### 🌐 Modern HA API Adoption

- **`hass.formatEntityState()`** — State display in sensors now uses the official HA formatting API (HA 2022.6+) instead of a manual `localize()` chain. Falls back gracefully on older HA versions. (`src/components/sensors.ts`)
- **`hass.performAction()`** — All service calls (`set_temperature`, `set_hvac_mode`, `set_preset_mode`, `turn_on`/`turn_off`) now use `performAction()` (HA 2024.8+) with automatic fallback to `callService()`. Extracted into `_callAction()` helper. (`src/main.ts`)
- **`getStubConfig()`** — Implemented static method; auto-selects the first `climate.*` entity when the card is added via the HA card picker. (`src/main.ts`)
- **`ha-icon-button ha-icon { display: flex }`** — Fix for icon buttons becoming invisible in recent HA versions due to internal `ha-icon-button` rendering changes. (`src/styles.css`)
- **`--ha-font-smoothing`** — Card now inherits HA's global font-smoothing setting (`-webkit-font-smoothing: var(--ha-font-smoothing, antialiased)`), consistent with all native HA cards. (`src/styles.css`)

### 🛠️ Deep-Dive Fixes (Round 3)

- **Toggle entity crash** — `parseToggle` would throw if the configured toggle entity was unavailable in `hass.states` (offline/removed device). Added null guard; returns `null` to suppress the toggle. (`src/config/header.ts`)
- **Unknown HVAC modes dropped** — The HVAC mode sort used a sparse array and `indexOf()`. Modes unknown to the card (e.g. custom firmware modes) got assigned to index `-1`, which `.map()` silently skips. Now appended at the end of the sorted list. (`src/main.ts`)
- **Unnecessary re-renders on every hass update** — `parseService()` was called inside `set hass()`, creating a new object on every HA state update. Since `service` is `@state()`, Lit scheduled a re-render each time. Moved to `setConfig()` where it belongs. (`src/main.ts`)
- **`dev:build` used `tsc --watch` instead of `rollup -c --watch`** — `tsc` alone produces no bundle and no CSS; the dev workflow was broken. Fixed. (`package.json`)
- **Vestigial `size-limit` config removed** — The `size-limit` block in `package.json` was orphaned after `size-limit.yml` was deleted. Removed. Added `typecheck` script (`tsc --noEmit`) as a useful replacement. (`package.json`)
- **Redundant `options = options || {}` in `fireEvent`** — Already handled by the default parameter. Removed. (`src/fireEvent.ts`)
- **`grid-gap` → `gap`** — `grid-gap` is deprecated in favour of the shorthand `gap`. Updated in `.sensors` and `.modes`. (`src/styles.css`)
- **`getStubConfig()` shallow copy** — `editor.ts` returned `{ ...stub }` which shared inner object references. Now uses `cloneDeep`. (`src/editor.ts`)
- **HACS validation workflow restored** — `hacs.yml` was deleted in the tooling cleanup but not recreated. Re-added with current action versions (`actions/checkout@v4`, `hacs/action@main`). (`.github/workflows/hacs.yml`)

### 🔨 Tooling & Cleanup

- Build: `@rollup/plugin-terser`, updated all Rollup/PostCSS/TypeScript plugins, Node 20
- TypeScript: `resolveJsonModule: true`, `moduleResolution: node` (was `bundler` — incompatible with VS Code language server), `target: ES2021`, `lib: ES2022`, `strictNullChecks: true` added
- Jest: renamed to `jest.config.cjs` (required with `"type": "module"`), modern ts-jest config, CSS mock — all 14 tests pass
- GitHub Actions: `actions/checkout@v4`, `setup-node@v4`, Node 20, npm; tag-based releases via `softprops/action-gh-release`
- `.gitignore` expanded and fixed (original had a syntax error)
- `hacs.json` minimum HA version updated from `0.84.0` to `2024.1.0`
- Removed orphaned files: `yarn.lock`, `tracker.json`, `.releaserc.json`, `size-limit.yml`
- Images moved to `assets/` for a cleaner root directory

### ⚡ Performance & Correctness (Round 4)

- **`set hass()` Short-Circuit** — The hass setter was recomputing header, modes, sensors, and setpoints on every HA state update system-wide, not just when this card's entity changed. With `hass.states[entityId]` object identity as change signal, full recomputation is now skipped when nothing relevant changed. A `_needsRecompute` flag ensures recomputation always runs after `setConfig`. (`src/main.ts`)
- **Entity disappears gracefully** — If the climate entity is removed from `hass.states` (integration restart, device removed), `this.entity` is now reset to `undefined`. Triggers the "Entity not available" error display instead of showing stale frozen data. (`src/main.ts`)
- **`setConfig` validates entity** — Throws immediately if no entity is configured instead of silently deferring the failure. (`src/main.ts`)
- **`editor.ts` `setConfig` shallow copy fixed** — `config || { ...stub }` shared object references with the `stub` constant. Now uses `cloneDeep`. (`src/editor.ts`)
- **Dead `getStubConfig` removed from editor** — HA calls `getStubConfig` only on the card class, not the editor. The editor's version was dead code with an inconsistent shape (no entity field). (`src/editor.ts`)
- **`getCardSize()` dynamic** — Now computes based on config (header ±1, modes ±1) instead of always returning `3`. (`src/main.ts`)
- **`getLayoutOptions()` dynamic** — `grid_rows` and `grid_max_rows` now derived from config. (`src/main.ts`)
- **`getUnit()` simplified** — Direct `!== undefined` guard replaces fragile `typeof` check. (`src/main.ts`)
- **`strictNullChecks: true`** — Enabled. All resulting errors fixed: definite-assignment assertions on class fields, local `entity` variable used in render/hass setter instead of `this.entity`. (`tsconfig.json`, `src/main.ts`, `src/editor.ts`)
- **`moduleResolution: "node"`** — Was `"bundler"` (TS 5.0+ only), causing VS Code's language server to fail resolving `lit` with cascading errors. Changed to `"node"` — universally compatible and correct for Rollup. (`tsconfig.json`)
- **Tests added** — `parseHeader.test.ts`: 5 tests covering toggle null guard, name resolution, false config. `hvacModeSort.test.ts`: 5 tests covering canonical sort, unknown modes appended (not dropped), no sparse holes, all-unknown list, empty list. (`src/test/`)

### 🎨 Custom CSS Editor

- **`styles` config field** — New `styles?: string` field in `CardConfig`. Arbitrary CSS injected directly into the card's Shadow DOM as a `<style>` tag, applied after all default styles. Enables the same patterns as card-mod: overriding `--st-*` CSS custom properties, targeting any internal selector. (`src/config/card.ts`, `src/main.ts`)
- **Visual editor support** — The card editor now includes a `ha-code-editor` block (with CSS syntax highlighting) at the bottom of the config panel, pre-populated with the current `styles` value. (`src/editor.ts`, `src/styles.css`)

### 🐛 Bug Fixes (Round 5)

- **`ui.swing_mode` and `ui.preset_mode` missing** — Both keys were documented in the README for `version: 3` templates but absent from the `uiKeys` array. Using `{{ui.swing_mode}}` or `{{ui.preset_mode}}` in a template returned `undefined`. (`src/components/templated.ts`)
- **v3 sensor crash when entity offline** — If a `version: 3` sensor referenced an entity not present in `hass.states` (offline, removed), `context` was `undefined` and destructuring it crashed the entire card render. Added early-return null guard. (`src/components/templated.ts`)
- **`wrapSensors` labels default ignored** — `layout.sensors: { type: 'list' }` (without an explicit `labels` key) left `showLabels` as `undefined` due to object-level fallback. Labels were hidden instead of defaulting to `true`. Fixed with per-field `??` defaults. (`src/components/templated.ts`)
- **Sensor entity state formatting** — `renderInfoItem` was still using the old manual `localize(state.state, prefix)` for sensor entities. Now uses `hass.formatEntityState?.(state)` with the localize chain as fallback, consistent with the climate entity state handling in `sensors.ts`. (`src/components/infoItem.ts`)
- **Template syntax errors crash card** — An invalid Squirrelly template (syntax error, bad filter) threw an uncaught exception and crashed the full card render. `Sqrl.render()` is now wrapped in try/catch; broken templates render an inline `[template error: …]` message instead. (`src/components/templated.ts`)
- **Preset/fan/swing mode names not localized** — `renderModeType` used the legacy `state_attributes.climate.${type}_mode.` prefix which is no longer populated in modern HA. Now uses the current `component.climate.entity_component._.state_attributes.${type}_mode.state.` key with fallback to the old prefix. (`src/components/modeType.ts`)

### 🐛 Bug Fixes (Round 6)

- **Temperature display missing by default (critical regression)** — `parseSetpoints` was called with `false` when `setpoints` was not configured (`this.config.setpoints ?? false`). The function treats `false` as "hide temperature", so cards without an explicit `setpoints` config showed no temperature at all. Fixed by passing `this.config.setpoints` directly (undefined falls through to auto-detect). (`src/main.ts`, `src/config/setpoints.ts`)
- **Fault icons render when entity is offline** — `parseFaults` did not guard against fault entities absent from `hass.states`. Non-existent entities produced an empty (iconless) fault indicator. Now filtered out, consistent with the `parseToggle` null guard. (`src/config/header.ts`)
- **`PreparedSensor.context` typed non-nullable** — The type said `LooseObject` but a v3 sensor referencing an offline entity produces `undefined` context. Updated to `LooseObject | undefined` so TypeScript catches misuse. (`src/types.ts`)
- **`setpoints: false` not in CardConfig type** — `parseSetpoints` accepted `false` to explicitly hide the temperature control, but `CardConfig.setpoints` did not allow it. Added `false` as a valid value, consistent with `header: false`, `control: false`, etc. (`src/config/card.ts`)
- **Loose equality `==` in modeType** — `type == 'hvac'` used loose equality instead of strict `===`. (`src/components/modeType.ts`)

### 🐛 Bug Fixes (Round 7)

- **Attribute-only sensor crashes** — In v2 sensors, destructuring `entity` from the sensor config shadowed the outer climate entity variable. The `else if (attribute && attribute in entity.attributes)` branch then evaluated `entity` as `undefined` (the sensor config's entity field) rather than the climate entity object, throwing `TypeError`. Renamed the sensor config variable to `sensorEntity` and used the already-captured `attributes` reference. (`src/main.ts`)
- **`decimals` applied on top of `formatEntityState` output** — When `hass.formatEntityState` returned a formatted string with unit (e.g. `"23.5 °C"`), subsequently applying `formatNumber` parsed it as `NaN` and returned `"N/A"`. `decimals` is now only applied when HA did not already format the value. (`src/components/infoItem.ts`)
- **`openEntityPopover` called without null guard** — The click handler in `renderInfoItem` called `openEntityPopover(state.entity_id)` directly, but the parameter is marked optional in the interface. Changed to `openEntityPopover?.(...)`. (`src/components/infoItem.ts`)
- **`parseFaults` type mismatch** — The function signature accepted `Array<Fault>` but the call site passes `Array<Fault> | undefined`. Updated signature to match. (`src/config/header.ts`)
