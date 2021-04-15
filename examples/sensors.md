# Different example usage of sensors with templating support (2.4 release)

You must set `version: 3` on the card to enable these features.

### Render a state value from a different entity:

This is the basic, most used case. Just render the state of a different sensor.
All that happens when you don't pass a template is that a default template is used for label + value.
The two following sensors are thus equal

```yaml
type: 'custom:simple-thermostat'
entity: climate.living_room
version: 3
sensors:
  - entity: sensor.living_room_humidity

  - entity: sensor.living_room_humidity
    template: '{{state.text}}'
    label: '{{friendly_name}}'
```

### Override default state/temperature sensors

By default you get two sensors that are built-in, which you can override by including a sensor with an `id` set to one of the following.
Note that this shows the default configurations, so doing this means you get the built-in result, you just moved the definition away from the defaults logic to your own config.
But you can use this to tweak it.

```yaml
type: 'custom:simple-thermostat'
entity: climate.living_room
version: 3
sensors:
  - id: state
    label: '{{ui.operation}}'
    template: '{{state.text}}'
  - id: temperature
    label: '{{ui.currently}}'
    template: '{{current_temperature|formatNumber}}'
```

You need to filter current_temperature through `formatNumber` to get a number that respects your config for `decimals`. In the same way, you can use `formatNumber` on any numeric value to show it using the desired decimals.

The `ui.operation` value looks strange, but we'll get back to what the `ui` variable represents in the translations section.

### Render attributes from the main climate entity with templates

> You can use `state` + all attributes from the entity in your template.

```yaml
type: 'custom:simple-thermostat'
entity: climate.living_room
version: 3
sensors:
  - label: Min/max temp
    template: '{{min_temp}} / {{max_temp}}'
```

Templating with lists of values, use `filters` to prepare it to a string:

```yaml
type: 'custom:simple-thermostat'
entity: climate.living_room
version: 3
sensors:
  - label: Supported HVAC modes
    template: "{{hvac_modes|join(', ')}}"
```

### Use a different entity as context

All the attributes from the entity referenced can be reached as variables in the template.

```yaml
type: 'custom:simple-thermostat'
entity: climate.living_room
version: 3
sensors:
  - label: Temperature
    entity: sensor.multisensor_living_room
    template: '{{temperature}} {{unit_of_measurement}}'
```

### Pass custom variables

You can also pass an object with variables so you don't have to keep long strings in templates.
This also showcases how you can render a dynamic icon based on a value.
Lets replace the built-in `State` with an icon

```yaml
type: 'custom:simple-thermostat'
entity: climate.living_room
version: 3
variables:
  icons:
    idle: 'mdi:sleep'
    heat: 'mdi:radiator'
sensors:
  - label: State
    id: state
    template: '{{v.icons[state.raw]|icon}}'
```

Wows, now that seems awfully complex.
To break it down. You can render an icon with `{{"mdi:sleep"|icon}}`, and the `variables` config is made accessible under `v`. So we look up the icon matching `state.raw`, then finally we pass it to a _filter_ named `icon`. The `icon` filter will make sure the passed value is shown as an icon. You can pass `mdi:<name>` and `hass:<name>` to it.

### Available filters

| Name         | Description                                     | Example        |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------- |
| icon         | Render as icon                                  | `{{"mdi:sleep"\|icon}}`                                       |
| translate    | Use HA translation string                       | `{{"on"\| translate("state.default.")}}`                |
| formatNumber | Format a number with x decimals                 | `{{3\|formatNumber({ decimals: 3 }) }}`             |
| css          | (For the crazy ones). Set custom css properties | `{{state.text\| css({ 'font-size': '3em', color: 'red' }) }}` |
| debug        | Print a structure as a JSON string              | `{{state\| debug}}`                                      |


### Translations

You can look up translated strings from all the UI translation strings HA uses. Its over a thousand strings so we will not list them all, but if you know about your string you can reach it like this in your template:

`{{"on"|translate("state.default.")}}`

This will match the `on` string under the prefix `state.default.`, so resulting in a translation string with the key `state.default.on`.
The reason its split in a string + a prefix is that while this string were typed out you often have a dynamic string under a fixed prefix.

**The ui object**

You can reach all the translations for the HA native climate card under `ui.<key>` as a shorthand.
The full list of available translations as of writing this are:

| Key                            | Value                              |
| ------------------------------ | ---------------------------------- |
| `ui.currently`                 | `Currently`                        |
| `ui.on_off`                    | `On / off`                         |
| `ui.target_temperature`        | `Target temperature`               |
| `ui.target_temperature_entity` | `{name} target temperature`        |
| `ui.target_temperature_mode`   | `{name} target temperature {mode}` |
| `ui.current_temperature`       | `{name} current temperature`       |
| `ui.heating`                   | `{name} heating`                   |
| `ui.cooling`                   | `{name} cooling`                   |
| `ui.high`                      | `high`                             |
| `ui.low`                       | `low`                              |
| `ui.target_humidity`           | `Target humidity`                  |
| `ui.operation`                 | `Operation`                        |
| `ui.fan_mode`                  | `Fan mode`                         |
| `ui.swing_mode`                | `Swing mode`                       |
| `ui.preset_mode`               | `Preset`                           |
| `ui.away_mode`                 | `Away mode`                        |
| `ui.aux_heat`                  | `Aux heat`                         |

At the moment the {name} and {mode} in some strings are not interpolated
