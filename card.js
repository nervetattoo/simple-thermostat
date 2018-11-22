import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.6.1/lit-element.js?module';


function renderStyles () {
  return html`
    <style is="custom-style">
      ha-card {
        padding: 8px;
        --thermostat-font-size-xl: var(--paper-font-display3_-_font-size);
        --thermostat-font-size-l: var(--paper-font-display2_-_font-size);
        --thermostat-font-size-m: var(--paper-font-title_-_font-size);
      }
      div:empty { display: none; }
      .body {
        display: flex;
        flex-direction: row;
      }
      .section {
        width: 50%;
      }
      .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      header {
        display: flex;
        justify-content: center;
        padding: 4px 0;
      }
      .title {
        font-size: var(--thermostat-font-size-m);
        font-weight: normal;
        margin: 0;
        align-self: left;
      }
      .current {
        display: flex;
        flex-direction: row;
        align-items: center;
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
      dl, dt, dd {
        padding: 0;
        margin: 0,
      }
      dl {
        display: flex;
        flex-direction: row;
      }
      dt {
        font-weight: 500;
      }
      dd {
        margin-left: 4px;
        font-weight: 300;
      }
    </style>
  `
}

class BetterThermostat extends LitElement {

  static get properties () {
    return {
      _hass: Object,
      config: Object,
      entity: Object,
      energy: Object,
      power: Object,
    }
  }

  set hass (hass) {
    this._hass = hass

    const entity = hass.states[this.config.entity]
    if (this.entity !== entity) {
      this.entity = entity;
    }

    const energy = hass.states[this.config.energy]
    if (this.energy !== energy) {
      this.energy = energy;
    }

    const power = hass.states[this.config.power]
    if (this.power !== power) {
      this.power = power;
    }
  }

  render ({ _hass, config, entity, energy, power } = this) {
    if (!entity) return
    console.log(entity, energy, power)
    const {
      state,
      attributes: {
        current_temperature: current,
        temperature: desired,
        operation_list: operations,
        operation_mode: operation,
      },
    } = entity
    const unit = '℃'

    return html`
      ${renderStyles()}
      <ha-card
      >
        <header>
          <h2 class="title">${entity._entityDisplay}</h2>
        </header>
        <section class="body">
          <div class="main section">
            <paper-icon-button
              class="thermostat-trigger"
              icon="hass:chevron-up"
              @click='${() => this.setTemperature(desired + .5)}'
            >
            </paper-icon-button>
            <div class="current" @click='${() => this.openEntityPopover(config.entity)}'>
              <h3 class="current--value">${desired}</h3>
              <span class="current--unit">${unit}</span>
            </div>
            <paper-icon-button
              class="thermostat-trigger"
              icon="hass:chevron-down"
              @click='${() => this.setTemperature(desired - .5)}'
            >
            </paper-icon-button>
          </div>
          <div class="section info">
            <dl>
              <dt>Temperature:</dt>
              <dd>${current}${unit}</dd>
            </dl>
            <dl>
              <dt>State:</dt>
              <dd>${state}</dd>
            </dl>
            ${ config.energy && this.renderInfoItem('energy', 'Energy today') }
            ${ config.power && this.renderInfoItem('power', 'Current power') }
          </div>
        </section>
      </ha-card>
    `
  }

  renderInfoItem (name, heading) {
    const entityId = this.config[name]
    const state = name in this && this[name]
    if (!state) return

    return html`
      <dl @click='${() => this.openEntityPopover(entityId)}' >
        <dt>${heading}:</dt>
        <dd>${state.state} ${state.attributes.unit_of_measurement}</dd>
      </dl>
    `
  }

  setTemperature (target) {
    console.log('set temp', target)
    this._hass.callService("climate", "set_temperature", {
      entity_id: this.config.entity,
      temperature: target,
    })
  }


  openEntityPopover (entityId) {
    this.fire('hass-more-info', { entityId });
  }

  fire (type, detail, options) {
    options = options || {};
    detail = (detail === null || detail === undefined) ? {} : detail;
    const e = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed
    });
    e.detail = detail;
    this.dispatchEvent(e);
    return e;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('better-thermostat', BetterThermostat);
