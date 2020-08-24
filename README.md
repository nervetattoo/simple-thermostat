# Lovelace simple thermostat card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

A different take on the thermostat card for Home Assistant Lovelace UI.
The aim is to provide a card with simpler interactions that are easier to use and take up less space, as well as provide more modularity to tweak the card. For example the abiltity to embed sensor values that are relevant to your thermostat (like humidity, energy usage, hours on +++).

![Example thermostat](https://github.com/nervetattoo/simple-thermostat/raw/master/thermostat-card.png)

## Compact mode

![Compact configuration](https://github.com/nervetattoo/simple-thermostat/raw/master/simple-thermostat-compact.png)

Hide everything but sensors and temperature control:

```yaml
type: custom:simple-thermostat
entity: climate.living_room
step_layout: row
name: false
icon: false
control: false
```

## Requirements

Home Assistant 0.84 or higher

## Installation

1. Download the `simple-thermostat.js` from the [latest release](https://github.com/nervetattoo/simple-thermostat/releases/latest) and store it in your `configuration/www` folder.
   _Previously you could download the source file from Github but starting from the 0.14 release that is no longer possible. If you try to do so it will crash_
2. Configure Lovelace to load the card:

```yaml
resources:
  - url: /local/simple-thermostat.js?v=1
    type: module
```

## Available configuration options:

- `entity` _string_: The thermostat entity id **required**
- `name` _string|false_: Override the card name, or disable showing a name at all. Default is to use the friendly_name of the thermostat provided
- `decimals` _number_: Specify number of decimals to use: 1 or 0
- `fallback` _string_: Specify a text to display if a valid set point can't be determined. Defaults to `N/A`
- `icon` _string|object_: Show an icon next to the card name. You can also pass an object to specify state-specific icons. Defaults state-specific icons radiator/radiator-disabled/snowflake
  - `idle`: _string_: Use this icon for state idle
  - `heating`: _string_ Use this icon for state heating
  - `cool`: _string_ Use this icon for state cool
- `step_size` _number_: Override the default 0.5 step size for increasing/decreasing the temperature
- `step_layout` _string_: `row` or `column` (default). Using `row` will make the card more compact
- `label` _object_: Override untranslated labels
  - `temperature`: _string_ Override Temperature label
  - `state`: _string_ Override State label
- `hide` _object_: Control specifically information fields to show. Defaults to showing everything
  - `temperature`: _bool_ (Default to `false`)
  - `state`: _bool_ (Default to `false`)
- `control` _object|array_ (From 0.27)
  - `_names` _bool_: Show mode names or not. Defaults to true
  - `_icons` _bool_: Show mode icons or not. Defaults to true
  - `_headings` _bool_: Show a heading for each mode button row. Defaults to true
  - `{type}` _object|bool_: The key of the mode type (hvac, preset, fan, swing)
    - `_name` _string_: Override the name of the mode type
    - `_hide_when_off` _bool_: Hides the mode type selection row when the entity is off. Defaults to false shown
    - `{mode}` _string_: Name of mode type to conttrol
      - `name` _string|bool_: Specify a custom name or set to `false` to show only the icon
      - `icon` _string|bool_: Specify a custom icon or set to `false` to not show icon
- `sensors` _array_
  - `entity` _string_: A sensor value entity id
  - `name` _string_: Specify a sensor name to use instead of the default friendly_name
  - `icon` _string_: Specify an icon to use instead of a name
  - `attribute` _string_: The key for an attribute to use instead of state. If this sensor has no entity it will use the main entity's attributes
  - `unit` _string_: When specifying an attribute you can manually set the unit to display

## Usage of the control config

In 0.27, in order to both support changes in the climate domain and to support controlling all modes like hvac, preset, fan and swing modes the old `modes` configuration have been removed and replaced with a `control` config.

The `control` config is most easily explained using a few examples as it supports both a simplified definition using just an array to list the types of modes to control. By default, with no config, it will show `hvac` and `preset` (if the entity supports it). You can replicate the default manually like this:

```yaml
control:
  - hvac
  - preset
```

This will list all modes for both types. You can get more fine grained control by switching to an object format and taking control of specific modes:

```yaml
control:
  preset:
    away: true
    none:
      name: Not set
```

What is worth noticing is that there is no merging of the default any more, so with this config you will not get `hvac_mode` displayed. If you still want it to display like default you need to set:

```yaml
control:
  preset:
    away: true
    none:
      name: Not set
  hvac: true
```

As previously you can define both `name` and `icon` on the individual modes, including setting them to `false`. What is new is that if you want to only show icons you can hide the names on all modes for the card (or vice versa for only showing names)

```yaml
control:
  _names: false
```

Please note that you need to quote off/on mode keys to not have them interprented as true/false.

```yaml
control:
  hvac:
    off: will not work
    "off": works
```

## Example usage:

```yaml
cards:
  - type: 'custom:simple-thermostat'
    entity: climate.my_room
    step_size: 1
    sensors:
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_energy
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_power
        name: Energy today
      - attribute: min_temp
        name: Min temp
    control:
      hvac:
        some_mode: false
        another_mode: false
        'off':
          name: Make it cold
          icon: false
        'on':
          name: false
          icon: mdi:whitewalker
```

## CSS vars for theming

The card uses the following CSS variables:

| Var name                    | Default value                           | Usage                                                |
| --------------------------- | --------------------------------------- | ---------------------------------------------------- |
| --st-font-size-xl           | var(--paper-font-display3\_-_font-size) | Used for target temperature                          |
| --st-font-size-l            | var(--paper-font-display2\_-_font-size) | Unused at the moment                                 |
| --st-font-size-m            | var(--paper-font-title\_-_font-size)    | Used for target temperature unit                     |
| --st-font-size-title        | var(--ha-card-header-font-size, 24      | Font size for card heading                           |
| --st-font-size-sensors      | var(--paper-font-subhead\_-_font-size)  | Font size for sensors                                |
| --st-spacing                | 4px                                     | Base unit for spacing. Used in multiples many places |
| --st-mode-active-background | var(--primary-color)                    | Background color for active mode button              |
| --st-mode-active-color      | var(--text-primary-color, #fff)         | Text color for active mode button                    |
| --st-mode-background        | #dff4fd                                 | Background color for inactive mode button            |

These variables can be changed globally in the current theme or on each card via card-mod.

### Example using custom theme

Example that makes everything smaller and more compact except sensors that gets blown up completely.

```yaml
example-theme:
  st-font-size-xl: 24px
  st-font-size-m: 20px
  st-font-size-title: 20px
  st-font-size-sensors: 30px
  st-spacing: 2px
```

### Example using card-mod

Same example as above, but will only apply to a single card.

```yaml
type: 'custom:simple-thermostat'
style: |
  ha-card {
    --st-font-size-xl: 24px;
    --st-font-size-m: 20px;
    --st-font-size-title: 20px;
    --st-font-size-sensors: 30px;
    --st-spacing: 2px;
  }
  ...
```
