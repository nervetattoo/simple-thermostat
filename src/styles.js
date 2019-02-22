import { html } from 'lit-element'

function renderVariables() {
  // prettier-ignore
  return `
    --thermostat-font-size-xl: var(--paper-font-display3_-_font-size);
    --thermostat-font-size-l: var(--paper-font-display2_-_font-size);
    --thermostat-font-size-m: var(--paper-font-title_-_font-size);
    --thermostat-font-size-title: 24px; --thermostat-spacing: 4px;
  `
}

export function renderNotFoundStyles() {
  // prettier-ignore
  return html`
    <style is="custom-style">
      ha-card {
        ${renderVariables()}
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);
      }
      .not-found {
        flex: 1;
        background-color: yellow;
        padding: calc(var(--thermostat-spacing) * 4);
      }
    </style>
  `
}

export function renderStyles() {
  // prettier-ignore
  return html`
    <style is="custom-style">
      ha-card {
        ${renderVariables()}
        -webkit-font-smoothing: var(
          --paper-font-body1_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-body1_-_font-size);
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);

        padding-bottom: calc(var(--thermostat-spacing) * 4);
      }

      ha-card.no-header {
        padding: calc(var(--thermostat-spacing) * 4) 0;
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
        font-size: 1.1em;
      }
      table:empty {
        display: none;
      }
      header {
        display: flex;
        flex-direction: row;
        align-items: center;

        font-family: var(--paper-font-headline_-_font-family);
        -webkit-font-smoothing: var(
          --paper-font-headline_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-headline_-_font-size);
        font-weight: var(--paper-font-headline_-_font-weight);
        letter-spacing: var(--paper-font-headline_-_letter-spacing);
        line-height: var(--paper-font-headline_-_line-height);
        text-rendering: var(
          --paper-font-common-expensive-kerning_-_text-rendering
        );
        opacity: var(--dark-primary-opacity);
        padding: calc(var(--thermostat-spacing) * 6)
          calc(var(--thermostat-spacing) * 4)
          calc(var(--thermostat-spacing) * 4);
      }
      .header__icon {
        margin-right: calc(var(--thermostat-spacing) * 2);
        color: var(--paper-item-icon-color, #44739e);
      }
      .header__title {
        font-size: var(--thermostat-font-size-title);
        line-height: var(--thermostat-font-size-title);
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
        font-size: var(--thermostat-font-size-xl);
        font-weight: 400;
        line-height: var(--thermostat-font-size-xl);
      }
      .current--unit {
        font-size: var(--thermostat-font-size-m);
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
      .sensors td.clickable {
        cursor: pointer;
      }
      .modes {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-left: calc(var(--thermostat-spacing) * 4);
        padding-right: calc(var(--thermostat-spacing) * 4);
      }
      .mode--active {
        color: var(--paper-item-icon-color, #44739e);
      }
      .mode__icon {
        padding-right: var(--thermostat-spacing);
      }
    </style>
  `
}
