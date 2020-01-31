import { css } from 'lit-element'

// prettier-ignore
export default css`
  :host {
    --st-default-spacing: 4px;
    --st-default-mode-active-color: #fff;
    --st-default-mode-background: #dff4fd;
  }
  ha-card {
    -webkit-font-smoothing: var(
      --paper-font-body1_-_-webkit-font-smoothing
    );
    font-size: var(--paper-font-body1_-_font-size);
    font-weight: var(--paper-font-body1_-_font-weight);
    line-height: var(--paper-font-body1_-_line-height);

    padding-bottom: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  }

  ha-card.no-header {
    padding: calc(var(--st-spacing, var(--st-default-spacing)) * 4) 0;
  }

  .not-found {
    flex: 1;
    background-color: yellow;
    padding: calc(var(--st-spacing, var(--st-default-spacing)) * 4);
  }

  .body {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    place-items: center;
    padding: 0 calc(var(--st-spacing, var(--st-default-spacing)) * 4);
    padding-bottom: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  }
  .main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .sensors {
    display: grid;
    grid: auto-flow / 1fr 2fr;
    grid-gap: var(--st-spacing, var(--st-default-spacing));
    font-size: var(--st-font-size-sensors, var(--paper-font-subhead_-_font-size, 16px));
  }
  .sensor-heading {
    text-align: right;
    font-weight: 300;
    padding-right: 8px;
    padding-bottom: 4px;
  }
  .sensors td {
    padding-bottom: 4px;
  }
  .sensors:empty {
    display: none;
  }
  header {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: calc(var(--st-spacing, var(--st-default-spacing)) * 6)
      calc(var(--st-spacing, var(--st-default-spacing)) * 4)
      calc(var(--st-spacing, var(--st-default-spacing)) * 4);
  }
  .header__icon {
    margin-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
    color: var(--paper-item-icon-color, #44739e);
  }
  .header__title {
    font-size: var(--st-font-size-title, var(--ha-card-header-font-size, 24px));
    line-height: var(--st-font-size-title, var(--ha-card-header-font-size, 24px));
    -webkit-font-smoothing: var(
      --paper-font-headline_-_-webkit-font-smoothing
    );
    font-weight: normal;
    margin: 0;
    align-self: left;
  }
  .current-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .current-wrapper.row {
    flex-direction: row-reverse;
  }
  .current--value-wrapper {
    display: flex;
    align-items: center;
  }
  .current--value {
    margin: 0;
    font-size: var(--st-font-size-xl, var(--paper-font-display3_-_font-size));
    font-weight: 400;
    line-height: var(--st-font-size-xl, var(--paper-font-display3_-_font-size));
  }
  .current--value.updating {
    color: var(--google-red-500);
  }
  .current--unit {
    font-size: var(--st-font-size-m, var(--paper-font-title_-_font-size));
  }
  .thermostat-trigger {
    padding: 0px;
  }
  .clickable {
    cursor: pointer;
  }
  .modes {
    display: grid;
    grid-template-columns: auto;
    grid-auto-flow: column;
    grid-gap: 2px;
    margin-top: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
    padding: var(--st-spacing, var(--st-default-spacing));
  }
  .modes.heading {
    grid-template-columns: min-content;
  }
  .mode-title {
    padding: 0 16px;
    place-self: center;
    font-size: var(--st-font-size-sensors, var(--paper-font-subhead_-_font-size, 16px));
    font-weight: 300;
    white-space: nowrap;
  }
  .mode-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    min-height: 24px;
    padding: var(--st-spacing, var(--st-default-spacing)) 0;
    background: var(--st-mode-background, var(--st-default-mode-background));
    color: var(--sidebar-selected-icon-color);
    cursor: pointer;
    border-radius: var(--st-spacing, var(--st-default-spacing));
  }
  .mode-item:hover {
    background: var(--st-mode-active-background, var(--primary-color));
    color: var(--st-mode-active-color, var(--st-default-mode-active-color));
    opacity: 0.5;
  }
  .mode-item.active, .mode-item.active:hover {
    background: var(--st-mode-active-background, var(--primary-color));
    color: var(--st-mode-active-color, var(--st-default-mode-active-color));
    opacity: 1;
  }
  .mode__icon {
    --iron-icon-width: 24px;
    --iron-icon-height: 24px;
    display: block;
  }
`
