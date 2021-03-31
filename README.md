# Lovelace simple thermostat card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
<a href="https://www.buymeacoffee.com/nervetattoo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="28" width="119"></a>

A different take on the thermostat card for Home Assistant Lovelace UI.
The aim is to provide a card with simpler interactions that are easier to use and take up less space, as well as provide more modularity to tweak the card. For example the abiltity to embed sensor values that are relevant to your thermostat (like humidity, energy usage, hours on +++).

![Example thermostat](https://github.com/nervetattoo/simple-thermostat/raw/master/thermostat-card.png)

## Compact mode

![Compact configuration](https://github.com/nervetattoo/simple-thermostat/raw/master/simple-thermostat-compact.png)

Hide everything but sensors and temperature control:

```yaml
type: custom:simple-thermostat
entity: climate.hvac
step_layout: row
show_header: false
control: false
```

## Note about 1.0 release

The 1.0 release only includes a rewrite to Typescript and a change of release management.
It does not include bug fixes or new features, in fact, due to the Typescript release I expect the 1.0 package to be less stable than 0.42.

## Requirements

Home Assistant 0.84 or higher

## Installation

1. Install via [HACS](https://hacs.xyz/).
2. Add to resources:
   ```yaml
   url: /hacsfiles/simple-thermostat/simple-thermostat.js
   type: module
   ```

<details>
   <summary>Manual install</summary>
1. Download the `simple-thermostat.js` from the [latest release](https://github.com/nervetattoo/simple-thermostat/releases/latest) and store it in your `configuration/www` folder.
   _Previously you could download the source file from Github but starting from the 0.14 release that is no longer possible. If you try to do so it will crash_
2. Configure Lovelace to load the card:

```yaml
resources:
  - url: /local/simple-thermostat.js?v=1
    type: module
```

</details>

## Available configuration options:

- `entity` _string_: The thermostat entity id **required**
- `header` _false|Header object_: See section about header config
- `setpoints` _false|Setpoints object_: See section about header config
- `unit` _string|bool_: Override the unit to display. Set to false to hide unit
- `decimals` _number_: Specify number of decimals to use: 1 or 0
- `fallback` _string_: Specify a text to display if a valid set point can't be determined. Defaults to `N/A`
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
- `sensors` _array|false_
  - `entity` _string_: A sensor value entity id
  - `name` _string_: Specify a sensor name to use instead of the default friendly_name
  - `icon` _string_: Specify an icon to use instead of a name
  - `attribute` _string_: The key for an attribute to use instead of state. If this sensor has no entity it will use the main entity's attributes
  - `unit` _string_: When specifying an attribute you can manually set the unit to display

## Header config

> New in 2.0. Old ways of defining toggle_entity, faults, name and icon are no longer supported

Hiding the entire header is done with `header: false`
If you pass an object you can pass any of the following keys.
Example:

```yaml
header:
  name: Overriden name
  toggle:
    entity: switch.light
    name: Light
  icon: mdi:sofa
  faults:
    - entity: switch.light
```

- `name` _string_: Override the card name. Default is to use the friendly_name of the thermostat provided
- `toggle` _object_: An entity id to create a toggle in the header for. This gives the option to control a separate entity which can be related to the thermostat entity (like a switch, or input_boolean)
  - `entity` _string_: The entity id to create the header for
  - `name` _string|bool_: Set the label to be shown to the left of the toggle. Set to true to show the friendly name of the toggle_entity
- `faults` _array|false_: Show fault conditions as active/inactive icons in the header
  - `entity` _string_: A binary sensor entity id
  - `icon` _string_: Override the entity icon
  - `hide_inactive` _bool_: Hide the fault icon when inactive (Default to `false`)
- `icon` _string|object_: Show an icon next to the card name. You can also pass an object to specify specific icons. Current value is taken from attributes.hvac_action when available, or state as fallback.
  - `auto`: _string_ Use this icon for hvac_action auto. Default mdi:radiator
  - `cooling`: _string_ Use this icon for hvac_action cooling. Default mdi:snowflake
  - `fan`: _string_ Use this icon for hvac_action fan. Default mdi:fan
  - `heating`: _string_ Use this icon for hvac_action heating. Default mdi:radiator
  - `idle`: _string_: Use this icon for hvac_action idle. Default mdi:radiator-disabled
  - `"off"`: _string_ Use this icon for hvac_action off. Default mdi:radiator-off
  - `auto`: _string_ Use this icon for state auto. Default hass:autorenew
  - `cool`: _string_ Use this icon for state cooling. Default hass:snowflake
  - `dry`: _string_: Use this icon for state dry. Default hass:water-percent
  - `fan_only`: _string_ Use this icon for state fan. Default hass:fan
  - `heat`: _string_ Use this icon for state heat. Default hass:autorenew
  - `heat_cool`: _string_: Use this icon for state heat_cool. Default hass:fire
  - `"off"`: _string_ Use this icon for state off. Default hass:power

## Setpoints config

> New in 2.0. Old ways of hiding setpoints is deprecated

If you specify setpoints manually you must include all setpoints you want included.
Normally there are only two possibilities here; `temperature` or `target_temp_high` + `target_temp_low`. Single or dual thermostats. But, theoretically there could be multiple setpoints and this aims to support any permutation.
The new feature in 2.0 is the ability to hide one of the two setpoints for dual thermostats.

To manually specify to use the `temperature` attribute as a setpoint you do:

```yaml
setpoints:
  temperature:
```

For dual thermostats:

```yaml
setpoints:
  target_temp_low:
  target_temp_high:
```

To hide one of the dual setpoints:

```yaml
setpoints:
  target_temp_low:
    hide: true
  target_temp_high:
```

For climate devices supporting more setpoints you can include as many as you like.
Automatic detection of set points only work for the single/dual cases.

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
    faults:
      - entity: binary_sensor.my_room_communications_fault
      - entity: binary_sensor.my_room_low_battery_fault
        icon: mdi:battery-low
    toggle_entity: switch.pump_relay
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

```yaml
cards:
  - type: 'custom:simple-thermostat'
    entity: climate.my_room
    step_size: 1
    sensors:
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_energy
    toggle_entity:
      entity_id: switch.pump_relay
      name: Control the pump
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
| --st-toggle-label-color     | var(--text-primary-color)               | Text color for toggle label                          |
| --st-font-size-toggle-label | var(--paper-font-subhead\_-_font-size)  | Font size for toggle label                           |
| --st-fault-inactive-color   | var(--secondary-background-color)       | Icon color for inactive faults                       |
| --st-fault-active-color     | var(--accent-color)                     | Icon color for active faults                         |

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
