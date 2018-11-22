# better-thermostat
A better thermostat card for Home Assistant Lovelace UI

Example usage:

```yaml
cards:
  - type: custom:thermostat-card
    entity: climate.my_room
    energy: sensor.fibaro_system_fgwpef_wall_plug_gen5_energy
    power: sensor.fibaro_system_fgwpef_wall_plug_gen5_power
```
