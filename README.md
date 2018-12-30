# Lovelace simple thermostat card

A different take on the thermostat card for Home Assistant Lovelace UI.
The aim is to provide a card with simpler interactions that are easier to use and take up less space, as well as provide more modularity to tweak the card. For example the abiltity to embed sensor values that are relevant to your thermostat (like humidity, energy usage, hours on +++).

![Example thermostat](https://github.com/nervetattoo/simple-thermostat/raw/master/thermostat-card.png)

## Installation

1. Download the repo as a zip or with git clone and store it in `www/simple-thermostat/` in your configuration folder.
2. Configure Lovelace to load the card:
    ```
    resources:
      - url: /local/simple-thermostat/simple-thermostat.js?v=1
        type: module
    ```
### *(Optional)* Add to custom updater

1. Make sure you've the [custom_updater](https://github.com/custom-components/custom_updater) component installed and working.
2. Add a new reference under `card_urls` in your `custom_updater` configuration in `configuration.yaml`.

  ```yaml
  custom_updater:
    card_urls:
      - https://raw.githubusercontent.com/nervetattoo/simple-thermostat/allow-updates/tracker.json
  ```

## Available configuration options:

* `entity` *string*: The thermostat entity id **required**
* `name` *string|false*: Override the card name, or disable showing a name at all. Default is to use the friendly_name of the thermostat provided
* `icon` *string|object*: Show an icon next to the card name. You can also pass an object to specify state-specific icons. Defaults state-specific icons radiator/radiator-disabled/snowflake
  * `idle`: *string*: Use this icon for state idle
  * `heat`: *string* Use this icon for state heat
  * `cool`: *string* Use this icon for state cool
* `step_size` *number*: Override the default 0.5 step size for increasing/decreasing the temperature
* `hide` *object*: Control specifically information fields to show. Defaults to showing everything
  * `temperature`: *bool*
  * `state`: *bool*
  * `mode`: *bool*
* `sensors` *array*
  * `entity` *string*: A sensor value entity id **required**
  * `name` *string*: Specify a sensor name to use instead of the default friendly_name

## Example usage:

```yaml
cards:
  - type: custom:simple-thermostat
    entity: climate.my_room
    step_size: 1
    sensors:
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_energy
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_power
        name: Energy today
    hide:
      mode: true
```
