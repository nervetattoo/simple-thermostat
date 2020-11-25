import { LitElement, html } from 'lit-element'
import styles from './styles.css'

const fireEvent = (node, type, detail = {}, options = {}) => {
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  })

  event.detail = detail
  node.dispatchEvent(event)
  return event
}

const OptionsDecimals = ['0', '1']

const OptionsStepLayout = ['column', 'row']

export default class SimpleThermostatEditor extends LitElement {
  static get styles() {
    return styles
  }

  static get properties() {
    return { hass: {}, config: {} }
  }

  setConfig(config) {
    this.config = config
  }

  get getClimateEntities() {
    return Object.keys(this.hass.states).filter(
      eid => eid.substr(0, eid.indexOf('.')) === 'climate'
    )
  }

  get getEntities() {
    return Object.keys(this.hass.states)
  }

  render() {
    if (!this.hass) return html``

    return html`
      <div class="card-config">
        <div class="overall-config">
          <div class="side-by-side">
            <paper-dropdown-menu
              label="Entity (required)"
              .configValue="${'entity'}"
              @value-changed="${this.valueChanged}"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected="${this.getClimateEntities.indexOf(
                  this.config.entity
                )}"
              >
                ${this.getClimateEntities.map(
                  entity =>
                    html`
                      <paper-item>${entity}</paper-item>
                    `
                )}
              </paper-listbox>
            </paper-dropdown-menu>

            <paper-dropdown-menu
              label="Toggle Entity"
              .configValue="${'toggle_entity'}"
              @value-changed="${this.valueChanged}"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected="${this.getEntities.indexOf(
                  this.config.toggle_entity
                )}"
              >
                ${this.getEntities.map(
                  entity =>
                    html`
                      <paper-item>${entity}</paper-item>
                    `
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>

          <div class="side-by-side">
            <paper-input
              label="Name"
              .value="${this.config.name}"
              .configValue="${'name'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>

            <paper-input
              label="Icon"
              .value="${this.config.icon}"
              .configValue="${'icon'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="Decimals"
              .configValue=${'decimals'}
              @value-changed="${this.valueChanged}"
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsDecimals).indexOf(
                  this.config.decimals
                )}
              >
                ${Object.values(OptionsDecimals).map(
                  item =>
                    html`
                      <paper-item>${item}</paper-item>
                    `
                )}
              </paper-listbox>
            </paper-dropdown-menu>

            <paper-input
              label="Unit"
              .value="${this.config.unit}"
              .configValue="${'unit'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-input
              label="Step Size"
              .value="${this.config.step_size}"
              .configValue="${'step_size'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>

            <paper-dropdown-menu
              label="Step Layout"
              .configValue=${'step_layout'}
              @value-changed="${this.valueChanged}"
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsStepLayout).indexOf(
                  this.config.step_layout
                )}
              >
                ${Object.values(OptionsStepLayout).map(
                  item =>
                    html`
                      <paper-item>${item}</paper-item>
                    `
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>

          <div class="side-by-side">
            <paper-input
              label="Fallback"
              .value="${this.config.fallback}"
              .configValue="${'fallback'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div>
            Settings for label, control, sensors and hiding UI elements can only
            be configured in the code editor
          </div>
        </div>
      </div>
    `
  }

  valueChanged(ev) {
    if (!this.config || !this.hass) {
      return
    }
    const { target } = ev
    if (this[`_${target.configValue}`] === target.value) {
      return
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this.config[target.configValue]
      } else {
        this.config = {
          ...this.config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        }
      }
    }
    fireEvent(this, 'config-changed', { config: this.config })
  }
}
