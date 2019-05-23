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
    --st-mode-active-color: var(--text-primary-color, #fff);
  }

  ha-card {
    -webkit-font-smoothing: var(
      --paper-font-body1_-_-webkit-font-smoothing
    );
    font-size: var(--paper-font-body1_-_font-size);
    font-weight: var(--paper-font-body1_-_font-weight);
    line-height: var(--paper-font-body1_-_line-height);

    padding-bottom: calc(var(--st-spacing) * 4);
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
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .sensors {
    font-size: var(--st-font-size-sensors);
  }
  table:empty {
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
  .sensors th {
    text-align: right;
    font-weight: 300;
    padding-right: 8px;
    padding-bottom: 4px;
  }
  .sensors td {
    padding-bottom: 4px;
  }
  .clickable {
    cursor: pointer;
  }
  .modes {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-left: calc(var(--st-spacing) * 4);
    padding-right: calc(var(--st-spacing) * 4);
  }
  .mode--active {
    color: var(--paper-item-icon-color, #44739e);
  }
  .mode__icon {
    padding-right: var(--st-spacing);
  }

  mwc-button.active {
    background: var(--st-mode-active-background);
    color: var(--st-mode-active-color);
  }
`
