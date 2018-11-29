# better-thermostat
A better thermostat card for Home Assistant Lovelace UI

![Example thermostat](https://github.com/nervetattoo/better-thermostat/raw/master/thermostat-card.png)

## Installation

1. Download the repo as a zip or with git clone and store it in `www/better-thermostat/` in your configuration folder.
2. Configure Lovelace to load the card:
    ```
    resources:
      - url: /local/better-thermostat/card.js?v=1
        type: module
    ```

## Available configuration options:

* `entity` *string*: The thermostat entity id **required**
* `name` *string|false*: Override the card name, or disable showing a name at all. Default is to use the friendly_name of the thermostat provided
* `icon` *string*: Show an icon next to the card name
* `step_size` *number*: Override the default 0.5 step size for increasing/decreasing the temperature
* `sensors` *array*
  * `entity` *string*: A sensor value entity id **required**
  * `name` *string*: Specify a sensor name to use instead of the default friendly_name

## Example usage:

```yaml
cards:
  - type: custom:better-thermostat
    entity: climate.my_room
    step_size: 1
    sensors:
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_energy
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_power
        name: Energy today
```
