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

const OptionsStepSize = ['0.5', '1']

const OptionsStepLayout = ['column', 'row']

const includeDomains = ['climate']

const GithubReadMe =
  'https://github.com/nervetattoo/simple-thermostat/blob/master/README.md'

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

  _openLink() {
    window.open(GithubReadMe)
  }

  get _show_header() {
    if (this.config.show_header === false) {
      return false
    } else {
      return true
    }
  }

  render() {
    if (!this.hass) return html``

    return html`
      <div class="card-config">
        <div class="overall-config">
          <div class="side-by-side">
            <ha-entity-picker
              label="Entity (required)"
              .hass=${this.hass}
              .value="${this.config.entity}"
              .configValue=${'entity'}
              .includeDomains=${includeDomains}
              @change="${this.valueChanged}"
              allow-custom-entity
            ></ha-entity-picker>
          </div>

          <div class="side-by-side">
            <paper-input
              label="Name (optional)"
              .value="${this.config.name}"
              .configValue="${'name'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>

            <ha-icon-input
              label="Icon (optional)"
              .value="${this.config.icon}"
              .configValue=${'icon'}
              @value-changed=${this.valueChanged}
            ></ha-icon-input>
          </div>

          <ha-formfield label="Show Name and Icon?">
            <ha-switch
              .checked=${this._show_header}
              .configValue="${'show_header'}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="Decimals (optional)"
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
              label="Unit (optional)"
              .value="${this.config.unit}"
              .configValue="${'unit'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div class="side-by-side">
            <ha-entity-picker
              label="Toggle Entity (optional)"
              .hass=${this.hass}
              .value="${this.toggle_entity}"
              .configValue=${'toggle_entity'}
              @change="${this.valueChanged}"
              allow-custom-entity
            ></ha-entity-picker>

            <paper-input
              label="Fallback Text (optional)"
              .value="${this.config.fallback}"
              .configValue="${'fallback'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="Step Layout (optional)"
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

            <paper-dropdown-menu
              label="Step Size (optional)"
              .configValue=${'step_size'}
              @value-changed="${this.valueChanged}"
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsStepSize).indexOf(
                  this.config.step_size
                )}
              >
                ${Object.values(OptionsStepSize).map(
                  item =>
                    html`
                      <paper-item>${item}</paper-item>
                    `
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>

          <div class="side-by-side">
            <mwc-button @click=${this._openLink}>
              Configuration Options
            </mwc-button>

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
