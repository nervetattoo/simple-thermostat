import { css } from 'lit-element'

// prettier-ignore
export default css`
  :host {
    --st-font-size-xl: var(--paper-font-display3_-_font-size);
    --st-font-size-l: var(--paper-font-display2_-_font-size);
    --st-font-size-m: var(--paper-font-title_-_font-size);
    --st-font-size-title: var(--ha-card-header-font-size, 24px);
    --st-font-size-sensors: var(--paper-font-subhead_-_font-size, 16px);
    --st-spacing: 4px;
    --st-mode-active-background: var(--primary-color);
    --st-mode-active-color: #fff;
    --st-mode-background: #dff4fd;
  }

  ha-card {
    -webkit-font-smoothing: var(
      --paper-font-body1_-_-webkit-font-smoothing
    );
    font-size: var(--paper-font-body1_-_font-size);
    font-weight: var(--paper-font-body1_-_font-weight);
    line-height: var(--paper-font-body1_-_line-height);

    padding-bottom: calc(var(--st-spacing) * 2);
  }

  ha-card.no-header {
    padding: calc(var(--st-spacing) * 4) 0;
  }

  .not-found {
    flex: 1;
    background-color: yellow;
    padding: calc(var(--st-spacing) * 4);
  }

  .body {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    place-items: center;
    padding: 0 calc(var(--st-spacing) * 4);
    padding-bottom: calc(var(--st-spacing) * 2);
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
    grid-gap: var(--st-spacing);
    font-size: var(--st-font-size-sensors);
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

    padding: calc(var(--st-spacing) * 6)
      calc(var(--st-spacing) * 4)
      calc(var(--st-spacing) * 4);
  }
  .header__icon {
    margin-right: calc(var(--st-spacing) * 2);
    color: var(--paper-item-icon-color, #44739e);
  }
  .header__title {
    font-size: var(--st-font-size-title);
    line-height: var(--st-font-size-title);
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
  .current--value {
    margin: 0;
    font-size: var(--st-font-size-xl);
    font-weight: 400;
    line-height: var(--st-font-size-xl);
  }
  .current--unit {
    font-size: var(--st-font-size-m);
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
    margin-top: calc(var(--st-spacing) * 2);
    padding: var(--st-spacing);
  }
  .modes.heading {
    grid-template-columns: min-content;
  }
  .mode-title {
    padding: 0 16px;
    place-self: center;
    font-size: var(--st-font-size-sensors);
    font-weight: 300;
    white-space: nowrap;
  }
  .mode-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    padding: var(--st-spacing) 0;
    background: var(--st-mode-background);
    color: var(--sidebar-selected-icon-color);
    cursor: pointer;
    border-radius: var(--st-spacing);
  }
  .mode-item:hover {
    background: var(--primary-color);
    opacity: 0.5;
    color: var(--text-primary-color, #fff);
  }
  .mode-item.active, .mode-item.active:hover {
    background: var(--primary-color);
    opacity: 1;
    color: var(--text-primary-color, #fff);
  }
  .mode__icon {
    --iron-icon-width: 24px;
    --iron-icon-height: 24px;
    display: block;
  }
`