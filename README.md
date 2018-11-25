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

## Example usage:

```yaml
cards:
  - type: custom:better-thermostat
    entity: climate.my_room
    sensors:
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_energy
      - entity: sensor.fibaro_system_fgwpef_wall_plug_gen5_power
        name: Energy today
```
